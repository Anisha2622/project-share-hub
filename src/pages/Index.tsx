import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, UserCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            JobFit Resume Analysis Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your recruitment process with intelligent ATS scoring and resume analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border-2">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">HR Portal</CardTitle>
              <CardDescription className="text-base">
                Create jobs, apply, and analyze candidates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/hr/login">
                <Button className="w-full" size="lg">
                  Login as HR
                </Button>
              </Link>
              <Link to="/hr/register">
                <Button variant="outline" className="w-full" size="lg">
                  Register as HR
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-accent" />
              </div>
              <CardTitle className="text-2xl">Candidate Portal</CardTitle>
              <CardDescription className="text-base">
                Browse jobs, apply with ease, and track your application status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/candidate/login">
                <Button className="w-full" size="lg">
                  Login as Candidate
                </Button>
              </Link>
              <Link to="/candidate/register">
                <Button variant="outline" className="w-full" size="lg">
                  Register as Candidate
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
