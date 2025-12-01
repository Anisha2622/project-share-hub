import { Link } from "react-router-dom";
import CandidateHeader from "@/components/CandidateHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    title: "Fusion Core HCM",
    company: "BNY",
    experience: "3",
    skills: ["Oracle Core HCM", "Oracle Absence Management", "Time and Labor"],
  },
  {
    id: 2,
    title: "Python Developer",
    company: "Anisha Recruiting",
    experience: "0",
    skills: ["Python", "SQL", "Django", "AI/ML"],
  },
  {
    id: 3,
    title: "Software Developer",
    company: "ABC",
    experience: "0 to 3",
    skills: ["MongoDB", "SQL", "Node.js", "Express.js", "React"],
  },
  {
    id: 4,
    title: "Software Developer",
    company: "ABC",
    experience: "0",
    skills: ["MongoDB", "React", "SQL", "Node.js", "Express.js", "Java"],
  },
];

const mockApplications = [
  {
    id: 1,
    jobTitle: "Python Developer",
    company: "Anisha Recruiting",
    appliedDate: "11/1/2025",
    status: "pending",
  },
];

const CandidateDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CandidateHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Candidate Dashboard</h1>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {mockJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-base mt-1">{job.company}</CardDescription>
                    </div>
                    <Link to={`/candidate/jobs/${job.id}`}>
                      <Button>View & Apply</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Experience: {job.experience} {job.experience === "1" ? "year" : "years"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="applications">
            {mockApplications.length > 0 ? (
              <div className="space-y-4">
                {mockApplications.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{app.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">Applied on: {app.appliedDate}</p>
                        </div>
                        <Badge variant={app.status === "pending" ? "secondary" : "default"}>
                          {app.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No applications yet. Start applying for jobs!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateDashboard;
