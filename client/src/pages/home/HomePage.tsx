import { useState } from 'react'
import { useRouteLoaderData, Link } from 'react-router'
import beaver from '../../assets/beaver.svg'
import { ApiResponse } from 'shared'
import { Button } from '../../components/ui/button'

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface RootLoaderData {
    apiGatewayUrl: string;
    userServiceUrl: string;
}

export default function HomePage() {
    const rootData = useRouteLoaderData("root") as RootLoaderData;
    const API_GATEWAY_URL = rootData?.apiGatewayUrl || "http://localhost:3000";
    const USER_SERVICE_URL = rootData?.userServiceUrl || "http://localhost:3001";

    const [gatewayData, setGatewayData] = useState<ApiResponse | undefined>()
    const [userServiceData, setUserServiceData] = useState<ApiResponse | undefined>()
    const [usersData, setUsersData] = useState<User[] | undefined>()
    const [healthData, setHealthData] = useState<{ gateway?: any, userService?: any }>({})
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

    async function callGatewayHello() {
        setLoading(prev => ({ ...prev, gateway: true }))
        try {
            const req = await fetch(`${API_GATEWAY_URL}/hello`)
            const res: ApiResponse = await req.json()
            setGatewayData(res)
        } catch (error) {
            console.log('Gateway error:', error)
            setGatewayData({ message: 'Failed to connect to API Gateway', success: false })
        } finally {
            setLoading(prev => ({ ...prev, gateway: false }))
        }
    }

    async function callUserServiceHello() {
        setLoading(prev => ({ ...prev, userService: true }))
        try {
            const req = await fetch(`${USER_SERVICE_URL}/`)
            const res: ApiResponse = await req.json()
            setUserServiceData(res)
        } catch (error) {
            console.log('User Service error:', error)
            setUserServiceData({ message: 'Failed to connect to User Service', success: false })
        } finally {
            setLoading(prev => ({ ...prev, userService: false }))
        }
    }

    async function fetchUsers() {
        setLoading(prev => ({ ...prev, users: true }))
        try {
            const req = await fetch(`${USER_SERVICE_URL}/api/users`)
            const res: ApiResponse<User[]> = await req.json()
            if (res.success && res.data) {
                setUsersData(res.data)
            }
        } catch (error) {
            console.log('Fetch users error:', error)
            setUsersData([])
        } finally {
            setLoading(prev => ({ ...prev, users: false }))
        }
    }

    async function checkHealth() {
        setLoading(prev => ({ ...prev, health: true }))
        try {
            // Check API Gateway health
            const gatewayHealth = await fetch(`${API_GATEWAY_URL}/health`)
            const gatewayHealthRes = await gatewayHealth.json()

            // Check User Service health
            const userServiceHealth = await fetch(`${USER_SERVICE_URL}/health`)
            const userServiceHealthRes = await userServiceHealth.json()

            setHealthData({
                gateway: gatewayHealthRes,
                userService: userServiceHealthRes
            })
        } catch (error) {
            console.log('Health check error:', error)
            setHealthData({
                gateway: { status: 'error', message: 'Failed to connect' },
                userService: { status: 'error', message: 'Failed to connect' }
            })
        } finally {
            setLoading(prev => ({ ...prev, health: false }))
        }
    }

    async function createTestUser() {
        setLoading(prev => ({ ...prev, createUser: true }))
        try {
            const testUser = {
                name: `Test User ${Date.now()}`,
                email: `test${Date.now()}@example.com`,
                role: 'user'
            }

            const req = await fetch(`${USER_SERVICE_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testUser)
            })
            const res: ApiResponse<User> = await req.json()

            if (res.success) {
                // Refresh users list
                fetchUsers()
            }
        } catch (error) {
            console.log('Create user error:', error)
        } finally {
            setLoading(prev => ({ ...prev, createUser: false }))
        }
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen p-6">
            <a href="https://github.com/stevedylandev/bhvr" target="_blank">
                <img
                    src={beaver}
                    className="w-16 h-16 cursor-pointer"
                    alt="beaver logo"
                />
            </a>
            <h1 className="text-5xl font-black">bhvr</h1>
            <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
            <p>A typesafe fullstack monorepo with microservices</p>

            {/* Authentication Links */}
            <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                    <Link to="/auth/login">Login</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link to="/auth/register">Register</Link>
                </Button>
            </div>

            {/* Service Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">API Gateway (Port 3000)</h3>
                    <Button
                        onClick={callGatewayHello}
                        disabled={loading.gateway}
                        className="w-full"
                    >
                        {loading.gateway ? 'Loading...' : 'Test Gateway'}
                    </Button>
                    {gatewayData && (
                        <div className="bg-blue-50 p-3 rounded-md text-sm">
                            <div className="font-semibold">Gateway Response:</div>
                            <div>Message: {gatewayData.message}</div>
                            <div>Success: {gatewayData.success.toString()}</div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">User Service (Port 3001)</h3>
                    <Button
                        onClick={callUserServiceHello}
                        disabled={loading.userService}
                        className="w-full"
                        variant="secondary"
                    >
                        {loading.userService ? 'Loading...' : 'Test User Service'}
                    </Button>
                    {userServiceData && (
                        <div className="bg-green-50 p-3 rounded-md text-sm">
                            <div className="font-semibold">User Service Response:</div>
                            <div>Message: {userServiceData.message}</div>
                            <div>Success: {userServiceData.success.toString()}</div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">Health Check</h3>
                    <Button
                        onClick={checkHealth}
                        disabled={loading.health}
                        className="w-full"
                        variant="outline"
                    >
                        {loading.health ? 'Checking...' : 'Check Health'}
                    </Button>
                    {Object.keys(healthData).length > 0 && (
                        <div className="bg-purple-50 p-3 rounded-md text-sm">
                            <div className="font-semibold">Health Status:</div>
                            {healthData.gateway && (
                                <div>Gateway: {healthData.gateway.status || 'Connected'}</div>
                            )}
                            {healthData.userService && (
                                <div>User Service: {healthData.userService.status || 'Connected'}</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* User Management */}
            <div className="w-full border-t pt-6">
                <h3 className="font-bold text-xl mb-4 text-center">User Management</h3>
                <div className="flex gap-4 justify-center mb-4">
                    <Button
                        onClick={fetchUsers}
                        disabled={loading.users}
                        variant="secondary"
                    >
                        {loading.users ? 'Loading...' : 'Fetch Users'}
                    </Button>
                    <Button
                        onClick={createTestUser}
                        disabled={loading.createUser}
                    >
                        {loading.createUser ? 'Creating...' : 'Create Test User'}
                    </Button>
                </div>

                {usersData && (
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="font-semibold mb-2">Users ({usersData.length}):</div>
                        {usersData.length === 0 ? (
                            <div className="text-gray-500">No users found</div>
                        ) : (
                            <div className="grid gap-2">
                                {usersData.map((user) => (
                                    <div key={user.id} className="bg-white p-3 rounded border">
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-gray-600">{user.email}</div>
                                        <div className="text-xs text-gray-500">
                                            Role: {user.role} | Active: {user.isActive.toString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Documentation Link */}
            <div className="border-t pt-4">
                <Button
                    variant='secondary'
                    asChild
                >
                    <a target='_blank' href="https://bhvr.dev">
                        Documentation
                    </a>
                </Button>
            </div>
        </div>
    )
}
