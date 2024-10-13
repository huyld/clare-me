import { NextFunction, Request, Response } from "express"
import { Mock, mock } from "ts-jest-mocker"
import RedisCache from "../../../src/services/cache/RedisCache"
import AuthService from "../../../src/services/auth"

describe('Auth service', () => {
  let cacheStub: Mock<RedisCache>
  let req: Mock<Request>
  let res: Mock<Response>
  let nextFn: Mock<NextFunction>

  beforeAll(() => {
    cacheStub = mock(RedisCache)
    req = mock<Request>()
    res = mock<Response>()
    nextFn = jest.fn() as Mock<NextFunction>
    res.status = jest.fn().mockReturnThis()

    res.send = jest.fn().mockReturnThis()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should work', () => {
    const authService = new AuthService(cacheStub)
    expect(authService).not.toBeNull()
  })

  it('should return 401 if request does not have authorization header', async () => {
    req.headers = {}
    const authService = new AuthService(cacheStub)

    const doAuthMiddleware = authService.doAuth()
    await doAuthMiddleware(req, res, nextFn)

    expect(res.status.mock.calls.length).toBe(1)
    expect(res.status.mock.calls[0][0]).toBe(401)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send.mock.calls[0][0]).toBe('No Authorization header present')
  })

  it('should return 401 if authorization method is not Bearer token', async () => {
    req.headers = { authorization: 'Basic dXNlcjpwYXNzd29yZA==' }
    const authService = new AuthService(cacheStub)

    const doAuthMiddleware = authService.doAuth()
    await doAuthMiddleware(req, res, nextFn)

    expect(res.status.mock.calls.length).toBe(1)
    expect(res.status.mock.calls[0][0]).toBe(401)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send.mock.calls[0][0]).toBe('Authorization method must be Bearer')
  })

  it('should return 401 if the provided token cannot be found in cache', async () => {
    cacheStub.exists.mockReturnValue(Promise.resolve(0))

    const sampleToken = 'dXNlcjpwYXNzd29yZA=='
    req.headers = { authorization: `Bearer ${sampleToken}` }
    const authService = new AuthService(cacheStub)

    const doAuthMiddleware = authService.doAuth()
    await doAuthMiddleware(req, res, nextFn)

    expect(cacheStub.exists.mock.calls.length).toBe(1)
    expect(cacheStub.exists.mock.calls[0][0]).toBe(sampleToken)
    expect(res.status.mock.calls.length).toBe(1)
    expect(res.status.mock.calls[0][0]).toBe(401)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send.mock.calls[0][0]).toBe('No valid authorization token present')
  })

  it('should call next function if the provided token is in cache', async () => {
    cacheStub.exists.mockReturnValue(Promise.resolve(1))

    const sampleToken = 'dXNlcjpwYXNzd29yZA=='
    req.headers = { authorization: `Bearer ${sampleToken}` }
    const authService = new AuthService(cacheStub)

    const doAuthMiddleware = authService.doAuth()
    await doAuthMiddleware(req, res, nextFn)

    expect(cacheStub.exists.mock.calls.length).toBe(1)
    expect(cacheStub.exists.mock.calls[0][0]).toBe(sampleToken)
    expect(res.status.mock.calls.length).toBe(0)
    expect(res.send.mock.calls.length).toBe(0)
    expect((nextFn as jest.Mock).mock.calls.length).toBe(1)
  })
})
