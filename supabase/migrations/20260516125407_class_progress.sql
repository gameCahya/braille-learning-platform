CREATE TABLE public.class_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  module_id    UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'not_started'
               CHECK (status IN ('not_started', 'in_progress', 'completed')),
  updated_by   UUID REFERENCES public.profiles(id),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (classroom_id, module_id)
);

ALTER TABLE public.class_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_manage_class_progress"
ON public.class_progress
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.classrooms c
    WHERE c.id = class_progress.classroom_id
      AND c.teacher_id = auth.uid()
  )
);
