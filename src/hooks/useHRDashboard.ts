import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface JobPosting {
  id: string;
  title: string;
  company_name: string;
  description: string;
  experience_required: string | null;
  status: string | null;
  created_at: string | null;
  hr_id: string;
}

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  status: string | null;
  resume_url: string | null;
  applied_date: string | null;
  candidate_name?: string;
  job_title?: string;
  ats_score?: number | null;
}

export const useHRDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch jobs for current HR
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["hr-jobs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("hr_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as JobPosting[];
    },
    enabled: !!user?.id,
  });

  // Fetch applications for HR's jobs with candidate info
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["hr-applications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get all job IDs for this HR
      const jobIds = jobs.map(j => j.id);
      if (jobIds.length === 0) return [];

      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          profiles:candidate_id(name),
          job_postings:job_id(title),
          ats_results(score)
        `)
        .in("job_id", jobIds);
      
      if (error) throw error;
      
      return data.map((app: any) => ({
        ...app,
        candidate_name: app.profiles?.name || "Unknown",
        job_title: app.job_postings?.title || "Unknown",
        ats_score: app.ats_results?.[0]?.score || null,
      })) as Application[];
    },
    enabled: !!user?.id && jobs.length > 0,
  });

  // Fetch skills for a job
  const fetchJobSkills = async (jobId: string) => {
    const { data, error } = await supabase
      .from("required_skills")
      .select("skill_name")
      .eq("job_id", jobId);
    
    if (error) throw error;
    return data.map(s => s.skill_name);
  };

  // Create job mutation
  const createJob = useMutation({
    mutationFn: async (jobData: {
      title: string;
      company_name: string;
      description: string;
      experience_required: string;
      skills: string[];
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Create job posting
      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .insert({
          title: jobData.title,
          company_name: jobData.company_name,
          description: jobData.description,
          experience_required: jobData.experience_required,
          hr_id: user.id,
          status: "active",
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Add skills
      if (jobData.skills.length > 0) {
        const skillsToInsert = jobData.skills.map((skill, index) => ({
          job_id: job.id,
          skill_name: skill,
          priority_level: index + 1,
        }));

        const { error: skillsError } = await supabase
          .from("required_skills")
          .insert(skillsToInsert);

        if (skillsError) throw skillsError;
      }

      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-jobs"] });
      toast({
        title: "Job created",
        description: "Your job posting has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete job mutation
  const deleteJob = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", jobId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-jobs"] });
      toast({
        title: "Job deleted",
        description: "The job posting has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update application status
  const updateApplicationStatus = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-applications"] });
      toast({
        title: "Status updated",
        description: "Application status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate stats
  const stats = {
    totalJobs: jobs.length,
    totalApplicants: applications.length,
    accepted: applications.filter(a => a.status === "Accepted").length,
    rejected: applications.filter(a => a.status === "Rejected").length,
  };

  // Get applicant counts per job
  const getJobApplicantCounts = (jobId: string) => {
    const jobApps = applications.filter(a => a.job_id === jobId);
    return {
      total: jobApps.length,
      accepted: jobApps.filter(a => a.status === "Accepted").length,
      rejected: jobApps.filter(a => a.status === "Rejected").length,
    };
  };

  return {
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
    fetchJobSkills,
  };
};
