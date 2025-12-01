import { useNavigate, useParams } from "react-router-dom";
import CandidateHeader from "@/components/CandidateHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import { useState } from "react";

const mockJobDetails = {
  1: {
    title: "Fusion Core HCM",
    company: "BNY",
    experience: "3",
    skills: [
      { name: "Oracle Absence Management", priority: 4 },
      { name: "Oracle Core HCM", priority: 5 },
      { name: "Time and Labor", priority: 3 },
    ],
    description: "Fusion Functional Consultant",
  },
  2: {
    title: "Python Developer",
    company: "Anisha Recruiting",
    experience: "0",
    skills: [
      { name: "Python", priority: 5 },
      { name: "SQL", priority: 4 },
      { name: "Django", priority: 4 },
      { name: "AI/ML", priority: 3 },
    ],
    description: "Looking for a Python developer with experience in building scalable applications.",
  },
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApplication, setShowApplication] = useState(false);
  
  const job = id ? mockJobDetails[id as unknown as keyof typeof mockJobDetails] : undefined;

  if (!job) {
    return <div>Job not found</div>;
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/candidate/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CandidateHeader />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/candidate/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="text-lg">{job.company}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Experience Required:</h3>
                <p className="text-muted-foreground">{job.experience} {job.experience === "1" ? "year" : "years"}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Skills:</h3>
                <ul className="space-y-2">
                  {job.skills.map((skill, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>{skill.name}</span>
                      <Badge variant="outline">{skill.priority}/5</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Job Description:</h3>
                <p className="text-muted-foreground">{job.description}</p>
              </div>

              {!showApplication ? (
                <Button className="w-full" size="lg" onClick={() => setShowApplication(true)}>
                  Proceed to Application
                </Button>
              ) : (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Apply for this Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleApply} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resume">Upload Resume (PDF)</Label>
                        <Input id="resume" type="file" accept=".pdf" required />
                      </div>
                      <Button type="submit" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Application
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
