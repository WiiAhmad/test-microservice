import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router"
import { useState, useId } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [currentTab, setCurrentTab] = useState("basic")
    const termsId = useId()

    const handleNext = () => {
        setCurrentTab("password")
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-between w-full mb-4">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link to="/">← Back to Home</Link>
                                    </Button>
                                </div>
                                <h1 className="text-2xl font-bold">Create an account</h1>
                                <p className="text-muted-foreground text-balance">
                                    Enter your details to get started
                                </p>
                            </div>

                            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                                <TabsList className="bg-background w-full justify-start rounded-none border-b p-0">
                                    <TabsTrigger
                                        value="basic"
                                        className="bg-background data-[state=active]:border-b-primary h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none"
                                    >
                                        Basic Info
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="password"
                                        className="bg-background data-[state=active]:border-b-primary h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none"
                                    >
                                        Password
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="mt-6">
                                    <div className="grid gap-4">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="johndoe"
                                                required
                                            />
                                        </div>
                                        <Button type="button" onClick={handleNext} className="w-full">
                                            Next
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="password" className="mt-6">
                                    <div className="grid gap-4">
                                        <div className="grid gap-3">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showPassword ? "Hide password" : "Show password"}
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showConfirmPassword ? "Hide password" : "Show password"}
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Checkbox id={termsId} />
                                            <div className="grid gap-2">
                                                <Label htmlFor={termsId} className="gap-1 leading-4">
                                                    Accept terms and conditions
                                                </Label>
                                                <p className="text-muted-foreground text-xs">
                                                    By clicking this checkbox, you agree to the terms and conditions.
                                                </p>
                                            </div>
                                        </div>
                                        <Button type="submit" className="">
                                            Create Account
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/auth/login" className="underline underline-offset-4">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function RegisterPage() {
    return <RegisterForm />
}