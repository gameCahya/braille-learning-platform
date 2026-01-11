import { VoiceSettings } from "@/components/accessibility/VoiceSettings";

export default function VoiceSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Voice Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize text-to-speech for better learning experience
        </p>
      </div>
      <VoiceSettings />
    </div>
  );
}