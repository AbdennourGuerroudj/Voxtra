import { useState, useEffect } from "react";
import { User, Settings as SettingsIcon, Key, Bot, FileText, Plus } from "lucide-react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../components/ui/tabs";
import { Header } from "../components/Header";
import { ProfileSettings } from "../components/ProfileSettings";
import { AccountSettings } from "../components/AccountSettings";
import { APIKeySettings } from "../components/APIKeySettings";
import { LLMSettings } from "../components/LLMSettings";
import { SummaryTemplateDialog, type SummaryTemplate } from "../components/SummaryTemplateDialog";
import { SummaryTemplatesTable } from "../components/SummaryTemplatesTable";
import { useAuth } from "../contexts/AuthContext";

export function Settings() {
  const [activeTab, setActiveTab] = useState("transcription");
  const { getAuthHeaders } = useAuth();
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<SummaryTemplate | null>(null);
  const [summaryRefresh, setSummaryRefresh] = useState(0);
  const [llmConfigured, setLlmConfigured] = useState(false);

  // Fetch LLM config and models
  useEffect(() => {
    const fetchLLM = async () => {
      try {
        const cfgRes = await fetch('/api/v1/llm/config', { headers: { ...getAuthHeaders() }});
        if (!cfgRes.ok) { setLlmConfigured(false); return; }
        const cfg = await cfgRes.json();
        setLlmConfigured(!!cfg && cfg.is_active);
        // Set configured; models are chosen per-template in dialog now
        if (cfg && cfg.is_active) {
          setLlmConfigured(true);
        }
      } catch {
        setLlmConfigured(false);
      }
    };
    fetchLLM();
  }, [activeTab, getAuthHeaders]);


	// Dummy function for file select (Settings page doesn't upload files)
	const handleFileSelect = () => {
		// No file upload in settings
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto w-full max-w-6xl px-2 sm:px-6 md:px-8 py-3 sm:py-6">
				{/* Use the same Header component as Homepage */}
				<Header onFileSelect={handleFileSelect} />

				{/* Main Content Container with same styling as Homepage */}
				<div className="card-modern p-2 sm:p-6 mt-4 sm:mt-6">
					<div className="mb-4 sm:mb-8">
						<h1 className="text-2xl font-bold text-foreground mb-2">
							Settings
						</h1>
						<p className="text-muted-foreground">
							Manage your account settings and transcription profiles.
						</p>
					</div>

					{/* Tabbed Interface */}
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="space-y-4 sm:space-y-6"
						>
            <TabsList className="grid w-full grid-cols-5 items-center h-auto bg-muted p-1 rounded-xl">
                            <TabsTrigger
                                value="transcription"
                                aria-label="Transcription"
                                className="flex items-center justify-center gap-2 h-9 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-medium rounded-lg text-xs sm:text-sm"
                            >
									<SettingsIcon className="h-4 w-4" />
									<span className="hidden sm:inline">Transcription</span>
								</TabsTrigger>
									<TabsTrigger
										value="account"
										aria-label="Account"
										className="flex items-center justify-center gap-2 h-9 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-medium rounded-lg text-xs sm:text-sm"
									>
									<User className="h-4 w-4" />
									<span className="hidden sm:inline">Account</span>
								</TabsTrigger>
									<TabsTrigger
										value="apikeys"
										aria-label="API Keys"
										className="flex items-center justify-center gap-2 h-9 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-medium rounded-lg text-xs sm:text-sm"
									>
									<Key className="h-4 w-4" />
									<span className="hidden sm:inline">API Keys</span>
								</TabsTrigger>
								<TabsTrigger
									value="llms"
									aria-label="LLMs"
									className="flex items-center justify-center gap-2 h-9 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-medium rounded-lg text-xs sm:text-sm"
								>
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">LLMs</span>
            </TabsTrigger>
								<TabsTrigger
									value="summary"
									aria-label="Summary"
									className="flex items-center justify-center gap-2 h-9 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-medium rounded-lg text-xs sm:text-sm"
								>
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
							</TabsList>

						{/* Transcription Tab */}
						<TabsContent value="transcription" className="space-y-6">
							<ProfileSettings />
						</TabsContent>

						{/* Account Tab */}
						<TabsContent value="account" className="space-y-6">
							<AccountSettings />
						</TabsContent>

						{/* API Keys Tab */}
						<TabsContent value="apikeys" className="space-y-6">
							<APIKeySettings />
						</TabsContent>

          {/* LLMs Tab */}
          <TabsContent value="llms" className="space-y-6">
            <LLMSettings />
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Summarization Templates</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create and manage prompts used to summarize transcripts.</p>
                </div>
                <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingSummary(null);
                    setSummaryDialogOpen(true);
                  }}
                  disabled={!llmConfigured}
                  className={`relative overflow-hidden w-32 p-2 h-12 rounded-md text-xs font-bold flex items-center justify-center gap-1 z-10 group transition-all duration-200
                    ${llmConfigured
                      ? "bg-black text-white border-none cursor-pointer"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                    }`}
                >
                  {/* Static content (visible normally, fades on hover) */}
                  <span className="relative z-20 flex items-center gap-1 transition-colors duration-300 group-hover:text-transparent">
                    <Plus className="h-4 w-4" />
                    New Template
                  </span>

                  {/* Animated layered backgrounds */}
                  <span className="absolute w-40 h-32 -top-8 -left-4 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
                  <span className="absolute w-40 h-32 -top-8 -left-4 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
                  <span className="absolute w-40 h-32 -top-8 -left-4 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>

                  {/* Hover content (appears on top during animation) */}
                  <span className="absolute inset-0 flex items-center justify-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
                    <Plus className="h-4 w-4" />
                    New Template
                  </span>
                </button>
                </div>
              </div>
              {!llmConfigured && (
                <div className="mb-3 text-sm text-muted-foreground bg-muted border border-border rounded-md px-3 py-2">
                  Configure an LLM provider in the LLMs tab to enable summary templates and model selection.
                </div>
              )}
              <SummaryTemplatesTable onEdit={(tpl) => { setEditingSummary(tpl); setSummaryDialogOpen(true); }} refreshTrigger={summaryRefresh} disabled={!llmConfigured} />
            </div>

            <SummaryTemplateDialog
              open={summaryDialogOpen}
              onOpenChange={(o) => { setSummaryDialogOpen(o); if (!o) setEditingSummary(null); }}
              initial={editingSummary}
              onSave={async (tpl) => {
                const headers: HeadersInit = { 'Content-Type': 'application/json', ...getAuthHeaders() };
                try {
                  if (tpl.id) {
                    await fetch(`/api/v1/summaries/${tpl.id}`, { method: 'PUT', headers, body: JSON.stringify({ name: tpl.name, description: tpl.description, model: tpl.model, prompt: tpl.prompt }) });
                  } else {
                    await fetch('/api/v1/summaries', { method: 'POST', headers, body: JSON.stringify({ name: tpl.name, description: tpl.description, model: tpl.model, prompt: tpl.prompt }) });
                  }
                } finally {
                  // keep user on Summary tab and refresh the list without a full reload
                  setSummaryDialogOpen(false);
                  setEditingSummary(null);
                  setSummaryRefresh((n) => n + 1);
                }
              }}
            />
          </TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
