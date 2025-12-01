import { useState } from "react";
import HRHeader from "@/components/HRHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Users, Briefcase } from "lucide-react";

const mockJobs = [
  { id: 1, title: "Python Developer", company: "Anisha Recruiting", posted: "9/28/2025", applicants: 3, accepted: 0, rejected: 0 },
  { id: 2, title: "Software Developer", company: "ABC", posted: "9/20/2025", applicants: 5, accepted: 1, rejected: 1 },
];

const mockApplications = [
  { id: 1, name: "Anisha Pawar", job: "Python Developer", score: 78, status: "pending" },
  { id: 2, name: "Sid", job: "Python Developer", score: null, status: "pending" },
  { id: 3, name: "Siddhi Kawade", job: "Python Developer", score: null, status: "pending" },
];

const HRDashboard = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <HRHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">HR Dashboard</h1>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="create">Create Job</TabsTrigger>
            <TabsTrigger value="upload">Upload Resumes</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockJobs.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockApplications.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                  <Users className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.map((job) => (
                    <Card key={job.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                            <p className="text-xs text-muted-foreground mt-1">Posted on: {job.posted}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm"><span className="font-medium">{job.applicants}</span> Applicants</p>
                            <p className="text-sm text-success"><span className="font-medium">{job.accepted}</span> Accepted</p>
                            <p className="text-sm text-destructive"><span className="font-medium">{job.rejected}</span> Rejected</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Job</CardTitle>
                <CardDescription>Post a new job opening for candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" placeholder="e.g., Senior Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (e.g., 2-4 years)</Label>
                    <Input id="experience" placeholder="Required experience" />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills Required</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., React"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the role, responsibilities, and requirements..."
                      rows={6}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Resumes for Analysis</CardTitle>
                <CardDescription>Bulk upload resumes for ATS scoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-select">Select Job</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>--Please choose a job--</option>
                    {mockJobs.map((job) => (
                      <option key={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resumes">Upload Resumes (up to 10)</Label>
                  <Input id="resumes" type="file" multiple accept=".pdf" />
                </div>
                <Button className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Analyze Resumes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((app) => (
                    <Card key={app.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{app.name}</h3>
                            <p className="text-sm text-muted-foreground">{app.job}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">ATS Score</p>
                              <p className="text-lg font-bold text-primary">
                                {app.score ? app.score : "N/A"}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">Download Resume</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HRDashboard;
