import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { VoxtraLogo } from "../components/VoxtraLogo";
import { useRouter } from "../contexts/RouterContext";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface RegisterProps {
	onRegister: (token: string) => void;
}

interface PasswordStrength {
	hasMinLength: boolean;
	hasUppercase: boolean;
	hasLowercase: boolean;
	hasNumber: boolean;
	hasSpecialChar: boolean;
}

export function Register({ onRegister }: RegisterProps) {
    const { navigate } = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Password strength validation
	const checkPasswordStrength = (pwd: string): PasswordStrength => ({
		hasMinLength: pwd.length >= 8,
		hasUppercase: /[A-Z]/.test(pwd),
		hasLowercase: /[a-z]/.test(pwd),
		hasNumber: /\d/.test(pwd),
		hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
	});

	const passwordStrength = checkPasswordStrength(password);
	const isPasswordValid = Object.values(passwordStrength).every(Boolean);
	const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!isPasswordValid) {
			setError("Please ensure your password meets all requirements");
			return;
		}

		if (!passwordsMatch) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/v1/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
					confirmPassword,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				onRegister(data.token);
			} else {
				const error = await response.json();
				setError(error.error || "Registration failed");
			}
		} catch (error) {
			console.error("Registration error:", error);
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const PasswordStrengthIndicator = ({ label, met }: { label: string; met: boolean }) => (
		<div className={`flex items-center gap-2 text-sm ${met ? 'text-muted-foreground' : 'text-destructive'}`}>
			{met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
			<span>{label}</span>
		</div>
	);

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
						<form onSubmit={handleSubmit} className="space-y-6">
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
									placeholder="Choose a username (3-50 characters)"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									disabled={loading}
									required
									minLength={3}
									maxLength={50}
									className="input-modern"
								/>
							</div>
							
							<div className="space-y-2">
									<Label htmlFor="password" className="text-foreground">
										Password
									</Label>
								<div className="relative">
											<Input
												id="password"
												type={showPassword ? "text" : "password"}
												placeholder="Create a secure password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												disabled={loading}
												required
												className="input-modern pr-10"
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											>
										{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								</div>
								
										{password && (
											<div className="mt-3 space-y-2 p-3 bg-muted rounded-lg">
												<p className="text-sm font-medium text-foreground">Password Requirements:</p>
										<div className="grid grid-cols-1 gap-1">
											<PasswordStrengthIndicator label="At least 8 characters" met={passwordStrength.hasMinLength} />
											<PasswordStrengthIndicator label="One uppercase letter" met={passwordStrength.hasUppercase} />
											<PasswordStrengthIndicator label="One lowercase letter" met={passwordStrength.hasLowercase} />
											<PasswordStrengthIndicator label="One number" met={passwordStrength.hasNumber} />
											<PasswordStrengthIndicator label="One special character" met={passwordStrength.hasSpecialChar} />
										</div>
									</div>
								)}
							</div>
							
							<div className="space-y-2">
									<Label htmlFor="confirmPassword" className="text-foreground">
										Confirm Password
									</Label>
								<div className="relative">
											<Input
												id="confirmPassword"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												disabled={loading}
												required
												className={`input-modern pr-10 ${
													confirmPassword && !passwordsMatch ? 'border-destructive' : ''
												}`}
											/>
											<button
												type="button"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											>
										{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								</div>
								
										{confirmPassword && (
											<div className={`flex items-center gap-2 text-sm ${
												passwordsMatch ? 'text-muted-foreground' : 'text-destructive'
											}`}>
												{passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
												<span>{passwordsMatch ? "Passwords match" : "Passwords do not match"}</span>
											</div>
										)}
							</div>
							
							<Button
								type="submit"
								className="relative overflow-hidden block mx-auto w-40 sm:w-48 p-2 h-12 bg-black text-white border-none rounded-md text-sm font-bold cursor-pointer z-10 group disabled:opacity-60 disabled:cursor-not-allowed"
								disabled={loading || !username.trim() || !isPasswordValid || !passwordsMatch}
							>
								{/* Static text (visible by default, fades on hover) */}
								<span className="relative z-20 transition-colors duration-300 group-hover:text-transparent">
									{loading ? "Creating Account..." : "Create Admin Account"}
								</span>

								{/* Animated layered backgrounds (same as Save + Sign In) */}
								<span className="absolute w-48 h-32 -top-8 -left-4 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
								<span className="absolute w-48 h-32 -top-8 -left-4 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
								<span className="absolute w-48 h-32 -top-8 -left-4 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>

								{/* Hover text fade-in (on top of animation) */}
								<span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
									{loading ? "Creating Account..." : "Create Admin Account"}
								</span>
							</Button>

						</form>
					</CardContent>
				</Card>

			</div>
		</div>
	);
}
