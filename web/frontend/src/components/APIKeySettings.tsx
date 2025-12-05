import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { APIKeyTable } from "./APIKeyTable";
import { APIKeyCreateDialog } from "./APIKeyCreateDialog";
import { APIKeyDisplayDialog } from "./APIKeyDisplayDialog";

interface CreatedAPIKey {
	id: string;
	name: string;
	description?: string;
	key: string;
	created_at: string;
}

export function APIKeySettings() {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [displayDialogOpen, setDisplayDialogOpen] = useState(false);
	const [createdKey, setCreatedKey] = useState<CreatedAPIKey | null>(null);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleCreateAPIKey = useCallback(() => {
		setCreateDialogOpen(true);
	}, []);

	const handleKeyCreated = useCallback(async (keyData: CreatedAPIKey) => {
		setCreatedKey(keyData);
		setCreateDialogOpen(false);
		setDisplayDialogOpen(true);
		setRefreshTrigger((prev) => prev + 1);
	}, []);

	const handleKeyChange = useCallback(() => {
		setRefreshTrigger((prev) => prev + 1);
	}, []);

	const handleDisplayDialogClose = useCallback(() => {
		setDisplayDialogOpen(false);
		setCreatedKey(null);
	}, []);

	return (
		<div className="space-y-6">
			<div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
							API Keys
						</h3>
					</div>
					<Button
						onClick={handleCreateAPIKey}
						className="overflow-hidden relative w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xs font-bold cursor-pointer z-10 group"
					>
						{/* Static text that never moves */}
						<span className="relative z-20 transition-colors duration-300 group-hover:text-transparent">
							Create New API Key
						</span>

						{/* Animated background layers */}
						<span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
						<span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
						<span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>

						{/* Hover overlay text (centered, fades in smoothly) */}
						<span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
							Create New API Key
						</span>
					</Button>

				</div>

				<APIKeyTable
					refreshTrigger={refreshTrigger}
					onKeyChange={handleKeyChange}
				/>
			</div>

			<APIKeyCreateDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onKeyCreated={handleKeyCreated}
			/>

			<APIKeyDisplayDialog
				open={displayDialogOpen}
				onOpenChange={setDisplayDialogOpen}
				apiKey={createdKey}
				onClose={handleDisplayDialogClose}
			/>
		</div>
	);
}
