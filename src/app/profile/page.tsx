import { User, Mail, Award, Clock } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Profile</h1>
        <p className="text-text-secondary text-sm mt-0.5">Your training account details</p>
      </div>

      <div className="panel p-6 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center bg-gold-dim text-2xl font-semibold text-gold font-mono mb-3">
          P
        </div>
        <h2 className="text-lg font-semibold text-text-primary">Pilot Trainee</h2>
        <p className="text-sm text-text-secondary mt-0.5">DA42-VI Multi-Engine Rating</p>

        <div className="grid grid-cols-3 gap-6 mt-6 w-full max-w-md text-center">
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">0</p>
            <p className="label-caps">Completed</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">--</p>
            <p className="label-caps">Avg Score</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">0h</p>
            <p className="label-caps">Study Time</p>
          </div>
        </div>
      </div>

      <div className="panel p-4 space-y-3">
        <h3 className="label-caps">Account Details</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-text-muted" />
            <span className="text-text-muted">Name:</span>
            <span className="text-text-primary">Pilot Trainee</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-text-muted" />
            <span className="text-text-muted">Email:</span>
            <span className="text-text-primary">--</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Award className="h-4 w-4 text-text-muted" />
            <span className="text-text-muted">Rating:</span>
            <span className="text-text-primary">Multi-Engine (In Training)</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-text-muted" />
            <span className="text-text-muted">Enrolled:</span>
            <span className="text-text-primary">--</span>
          </div>
        </div>
      </div>
    </div>
  );
}
