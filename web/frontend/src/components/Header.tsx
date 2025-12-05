import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, Mic, Settings, LogOut, Home, Plus, Grip, Zap, Youtube, Video, Users } from "lucide-react";
import { VoxtraLogo } from "./VoxtraLogo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AudioRecorder } from "./AudioRecorder";
import { QuickTranscriptionDialog } from "./QuickTranscriptionDialog";
import { YouTubeDownloadDialog } from "./YouTubeDownloadDialog";
import { useRouter } from "../contexts/RouterContext";
import { useAuth } from "../contexts/AuthContext";

interface FileWithType {
	file: File;
	isVideo: boolean;
}

interface HeaderProps {
	onFileSelect: (files: File | File[] | FileWithType | FileWithType[]) => void;
	onMultiTrackClick?: () => void;
	onDownloadComplete?: () => void;
}

export function Header({ onFileSelect, onMultiTrackClick, onDownloadComplete }: HeaderProps) {
	const { navigate } = useRouter();
	const { logout } = useAuth();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const videoFileInputRef = useRef<HTMLInputElement>(null);
	const [isRecorderOpen, setIsRecorderOpen] = useState(false);
	const [isQuickTranscriptionOpen, setIsQuickTranscriptionOpen] = useState(false);
	const [isYouTubeDialogOpen, setIsYouTubeDialogOpen] = useState(false);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleVideoUploadClick = () => {
		videoFileInputRef.current?.click();
	};

	const handleRecordClick = () => {
		setIsRecorderOpen(true);
	};

	const handleQuickTranscriptionClick = () => {
		setIsQuickTranscriptionOpen(true);
	};

	const handleYouTubeClick = () => {
		setIsYouTubeDialogOpen(true);
	};

	const handleMultiTrackClick = () => {
		onMultiTrackClick?.();
	};

	const handleSettingsClick = () => {
		navigate({ path: "settings" });
	};

	const handleLogout = () => {
		logout();
	};

	const handleHomeClick = () => {
		navigate({ path: "home" });
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			// Filter to only audio files
			const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
			if (audioFiles.length > 0) {
				onFileSelect(audioFiles.length === 1 ? audioFiles[0] : audioFiles);
				// Reset the input so the same files can be selected again
				event.target.value = "";
			}
		}
	};

	const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			// Filter to only video files
			const videoFiles = Array.from(files).filter(file => file.type.startsWith("video/"));
			if (videoFiles.length > 0) {
				// Pass video files with type marker
				const filesWithType: FileWithType[] = videoFiles.map(file => ({ file, isVideo: true }));
				onFileSelect(filesWithType.length === 1 ? filesWithType[0] : filesWithType);
				// Reset the input so the same files can be selected again
				event.target.value = "";
			}
		}
	};

	const handleRecordingComplete = async (blob: Blob, title: string) => {
		// Convert blob to file and use existing upload logic
		const file = new File([blob], `${title}.webm`, { type: blob.type });
		onFileSelect(file);
	};

	return (
		<header className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-sm glass-effect">
			<div className="flex items-center justify-between">
				{/* Left side - Logo navigates home */}
				<div className="flex items-center gap-4">
					<VoxtraLogo onClick={handleHomeClick} />
					<div className="hidden sm:block h-6 w-px bg-border"></div>
				</div>

				{/* Right side - Plus (Add Audio), Grip Menu, Theme Switcher */}
				<div className="flex items-center gap-3 sm:gap-4">
					{/* Add Audio (icon-only) */}
					
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
						<Button
							variant="default"
							size="icon"
							className="relative overflow-hidden btn-primary h-10 w-10 sm:h-11 sm:w-11 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group bg-black text-white border-none cursor-pointer"
						>
							{/* Icon layer (stays visible) */}
							<span className="relative z-20 transition-colors duration-300 group-hover:text-transparent">
								<Plus className="h-4 w-4" />
							</span>

							{/* Animated background layers (same as Save button) */}
							<span className="absolute w-16 h-16 -top-3 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
							<span className="absolute w-16 h-16 -top-3 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
							<span className="absolute w-16 h-16 -top-3 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>

							{/* Hover layer (white icon fade-in) */}
							<span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
								<Plus className="h-4 w-4" />
							</span>
						</Button>


						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-64 bg-popover border border-border shadow-xl rounded-xl p-2 glass-effect"
						>
							<DropdownMenuItem
								onClick={handleQuickTranscriptionClick}
								className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200"
							>
								<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
									<Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<div className="font-semibold text-sm">Quick Transcribe</div>
									<div className="text-xs text-muted-foreground">
										Fast transcribe without saving
									</div>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleYouTubeClick}
								className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200"
							>
								<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
									<Youtube className="h-4 w-4 text-red-600 dark:text-red-400" />
								</div>
								<div>
									<div className="font-semibold text-sm">YouTube URL</div>
									<div className="text-xs text-muted-foreground">
										Download audio from YouTube
									</div>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleUploadClick}
								className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200"
							>
								<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
									<Upload className="h-4 w-4 text-green-600 dark:text-green-400" />
								</div>
								<div>
									<div className="font-semibold text-sm">Upload Files</div>
									<div className="text-xs text-muted-foreground">
										Choose one or more audio files
									</div>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleVideoUploadClick}
								className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200"
							>
								<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
									<Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
								</div>
								<div>
									<div className="font-semibold text-sm">Upload Videos</div>
									<div className="text-xs text-muted-foreground">
										Extract audio from video files
									</div>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleRecordClick}
								className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200"
							>
								<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
									<Mic className="h-4 w-4 text-orange-600 dark:text-orange-400" />
								</div>
								<div>
									<div className="font-semibold text-sm">Record Audio</div>
									<div className="text-xs text-muted-foreground">
										Record using microphone
									</div>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleMultiTrackClick}
								className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200"
							>
								<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
									<Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
								</div>
								<div>
									<div className="font-semibold text-sm">Multi-Track Audio</div>
									<div className="text-xs text-muted-foreground">
										Upload multiple speaker tracks
									</div>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Main Menu (Grip) */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="h-10 w-10 sm:h-11 sm:w-11 cursor-pointer border-border hover:bg-accent hover:text-accent-foreground rounded-xl transition-all duration-200"
							>
								<Grip className="h-5 w-5" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-xl rounded-xl p-2 glass-effect">
							<DropdownMenuItem onClick={handleHomeClick} className="cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200 px-3 py-2">
								<Home className="h-4 w-4 mr-3" />
								<span className="font-medium">Home</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer hover:bg-accent text-foreground focus:bg-accent rounded-lg transition-all duration-200 px-3 py-2">
								<Settings className="h-4 w-4 mr-3" />
								<span className="font-medium">Settings</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground rounded-lg transition-all duration-200 px-3 py-2" variant="destructive">
								<LogOut className="h-4 w-4 mr-3" />
								<span className="font-medium">Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Theme Switcher (icon-only) */}
					<ThemeSwitcher />

					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="audio/*"
						multiple
						onChange={handleFileChange}
						className="hidden"
					/>
					
					{/* Hidden video file input */}
					<input
						ref={videoFileInputRef}
						type="file"
						accept="video/*"
						multiple
						onChange={handleVideoFileChange}
						className="hidden"
					/>
				</div>
			</div>

			{/* Audio Recorder Dialog */}
			<AudioRecorder
				isOpen={isRecorderOpen}
				onClose={() => setIsRecorderOpen(false)}
				onRecordingComplete={handleRecordingComplete}
			/>

			{/* Quick Transcription Dialog */}
			<QuickTranscriptionDialog
				isOpen={isQuickTranscriptionOpen}
				onClose={() => setIsQuickTranscriptionOpen(false)}
			/>

			{/* YouTube Download Dialog */}
			<YouTubeDownloadDialog
				isOpen={isYouTubeDialogOpen}
				onClose={() => setIsYouTubeDialogOpen(false)}
				onDownloadComplete={onDownloadComplete}
			/>

		</header>
	);
}
