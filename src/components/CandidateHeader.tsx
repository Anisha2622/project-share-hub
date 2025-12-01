import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const CandidateHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/candidate/dashboard" className="text-2xl font-bold text-primary">
          JobFit
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CandidateHeader;
