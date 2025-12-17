import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HRHeader from "@/components/HRHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Users, Briefcase, Trash2, Loader2 } from "lucide-react";
import { useHRDashboard } from "@/hooks/useHRDashboard";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const HRDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    jobs,
    applications,
    stats,
    jobsLoading,
    applicationsLoading,
    createJob,
    deleteJob,
    updateApplicationStatus,
    getJobApplicantCounts,
  } = useHRDashboard();

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    experience: "",
    description: "",
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJob.mutateAsync({
      title: formData.title,
      company_name: formData.company,
      description: formData.description,
      experience_required: formData.experience,
      skills,
    });
    // Reset form
    setFormData({ company: "", title: "", experience: "", description: "" });
    setSkills([]);
  };

  const handleDownloadResume = async (resumeUrl: string | null) => {
    if (!resumeUrl) return;
    const { data } = await supabase.storage.from("resumes").createSignedUrl(resumeUrl, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                  <div className="text-2xl font-bold">{stats.totalJobs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplicants}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.accepted}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : jobs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No job postings yet. Create your first job!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => {
                      const counts = getJobApplicantCounts(job.id);
                      return (
                        <Card key={job.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">{job.company_name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Posted on: {job.created_at ? format(new Date(job.created_at), "MM/dd/yyyy") : "N/A"}
                                </p>
                              </div>
                              <div className="flex items-start gap-4">
                                <div className="text-right space-y-1">
                                  <p className="text-sm"><span className="font-medium">{counts.total}</span> Applicants</p>
                                  <p className="text-sm text-green-600"><span className="font-medium">{counts.accepted}</span> Accepted</p>
                                  <p className="text-sm text-destructive"><span className="font-medium">{counts.rejected}</span> Rejected</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteJob.mutate(job.id)}
                                  disabled={deleteJob.isPending}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="Enter company name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (e.g., 2-4 years)</Label>
                    <Input
                      id="experience"
                      placeholder="Required experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
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
                        <Badge
                          key={i}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the role, responsibilities, and requirements..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createJob.isPending}>
                    {createJob.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="--Please choose a job--" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {applicationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No applications yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <Card key={app.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{app.candidate_name}</h3>
                              <p className="text-sm text-muted-foreground">{app.job_title}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">ATS Score</p>
                                <p className="text-lg font-bold text-primary">
                                  {app.ats_score ?? "N/A"}
                                </p>
                              </div>
                              <Select
                                defaultValue={app.status || "Applied"}
                                onValueChange={(value) =>
                                  updateApplicationStatus.mutate({ applicationId: app.id, status: value })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Applied">Applied</SelectItem>
                                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                                  <SelectItem value="Accepted">Accepted</SelectItem>
                                  <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadResume(app.resume_url)}
                                disabled={!app.resume_url}
                              >
                                Download Resume
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HRDashboard;
