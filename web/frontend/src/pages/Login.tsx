import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { VoxtraLogo } from "../components/VoxtraLogo";
import { useRouter } from "../contexts/RouterContext";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

interface LoginProps {
	onLogin: (token: string) => void;
}

export function Login({ onLogin }: LoginProps) {
    const { navigate } = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api/v1/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				onLogin(data.token);
			} else {
				const error = await response.json();
				setError(error.error || "Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="absolute top-8 right-8">
				<ThemeSwitcher />
			</div>
			
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<div className="flex justify-center mb-6">
						<VoxtraLogo onClick={() => navigate({ path: 'home' })} />
					</div>
				</div>

				<Card className="card-modern">
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
									<p className="text-destructive text-sm">{error}</p>
								</div>
							)}
							
							<div className="space-y-2">
								<Label htmlFor="username" className="text-foreground">
									Username
								</Label>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									disabled={loading}
									required
									className="input-modern"
								/>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="password" className="text-foreground">
									Password
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={loading}
									required
									className="input-modern"
								/>
							</div>
							
							<Button
								type="submit"
								className="relative overflow-hidden block mx-auto w-32 p-2 h-12 bg-black text-white border-none rounded-md text-sm font-bold cursor-pointer z-10 group disabled:opacity-60 disabled:cursor-not-allowed"
								disabled={loading || !username.trim() || !password.trim()}
							>
								{/* Static text (fades out on hover) */}
								<span className="relative z-20 transition-colors duration-300 group-hover:text-transparent">
									{loading ? "Signing in..." : "Sign In"}
								</span>

								{/* Animated layered backgrounds (same effect as Save button) */}
								<span className="absolute w-40 h-32 -top-8 -left-4 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
								<span className="absolute w-40 h-32 -top-8 -left-4 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
								<span className="absolute w-40 h-32 -top-8 -left-4 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>

								{/* Hover text fade-in */}
								<span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
									{loading ? "Signing in..." : "Sign In"}
								</span>
							</Button>

						</form>
					</CardContent>
				</Card>

			</div>
		</div>
	);
}
