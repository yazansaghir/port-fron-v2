import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { ProjectForm, type ProjectFormValues } from '@/features/admin/components/projects/ProjectForm';
import { EMPTY_PROJECT_FORM, toCreateRequest } from '@/features/admin/components/projects/projectFormUtils';
import { useCreateProject } from '@/features/projects/hooks/useCreateProject';
import { getDisplayMessage, getFieldErrorsRecord } from '@/shared/api/mapApiError';

export default function ProjectCreatePage() {
  const [values, setValues] = useState<ProjectFormValues>(EMPTY_PROJECT_FORM);

  const createProject = useCreateProject();

  const fieldErrors = createProject.error ? getFieldErrorsRecord(createProject.error) : {};
  const generalError =
    createProject.error && Object.keys(fieldErrors).length === 0
      ? getDisplayMessage(createProject.error)
      : null;

  function handleChange(field: keyof ProjectFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createProject.mutate(toCreateRequest(values));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/projects"
          className="rounded-md border border-foreground/15 px-2.5 py-1 text-xs font-medium text-foreground/70 transition hover:bg-foreground/5 hover:text-foreground"
        >
          ← Back
        </Link>
        <h2 className="text-lg font-semibold text-foreground">New project</h2>
      </div>

      {/* Form card */}
      <AdminCard className="p-6">
        <ProjectForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          disabled={createProject.isPending}
          fieldErrors={fieldErrors}
          generalError={generalError}
          submitLabel="Create project"
        />
      </AdminCard>
    </motion.div>
  );
}
