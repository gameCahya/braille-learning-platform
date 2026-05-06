drop extension if exists "pg_net";

create type "public"."user_role" as enum ('teacher', 'student');


  create table "public"."chat_history" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "message" text not null,
    "response" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."chat_history" enable row level security;


  create table "public"."classrooms" (
    "id" uuid not null default gen_random_uuid(),
    "teacher_id" uuid not null,
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."classrooms" enable row level security;


  create table "public"."learning_activities" (
    "id" uuid not null default gen_random_uuid(),
    "student_id" uuid not null,
    "module_id" uuid,
    "lesson_id" text,
    "activity_type" text not null,
    "score" numeric(5,2),
    "details" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."learning_activities" enable row level security;


  create table "public"."modules" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "title" text not null,
    "description" text,
    "content" jsonb not null,
    "braille_content" text,
    "difficulty" text not null,
    "order_number" integer not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."modules" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "classroom_id" uuid,
    "role" public.user_role default 'teacher'::public.user_role
      );


alter table "public"."profiles" enable row level security;


  create table "public"."quiz_results" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "module_id" uuid not null,
    "score" integer not null,
    "total_points" integer not null,
    "correct_answers" integer not null,
    "total_questions" integer not null,
    "answers" jsonb not null,
    "details" jsonb,
    "feedback" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "student_id" uuid
      );


alter table "public"."quiz_results" enable row level security;


  create table "public"."students" (
    "id" uuid not null default gen_random_uuid(),
    "teacher_id" uuid not null,
    "classroom_id" uuid,
    "full_name" text not null,
    "email" text,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."students" enable row level security;


  create table "public"."user_progress" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "module_id" uuid not null,
    "completed" boolean default false,
    "score" integer,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "student_id" uuid
      );


alter table "public"."user_progress" enable row level security;

CREATE UNIQUE INDEX chat_history_pkey ON public.chat_history USING btree (id);

CREATE UNIQUE INDEX classrooms_pkey ON public.classrooms USING btree (id);

CREATE INDEX idx_chat_history_user_id ON public.chat_history USING btree (user_id);

CREATE INDEX idx_classrooms_teacher_id ON public.classrooms USING btree (teacher_id);

CREATE INDEX idx_learning_activities_module_id ON public.learning_activities USING btree (module_id);

CREATE INDEX idx_learning_activities_student_id ON public.learning_activities USING btree (student_id);

CREATE INDEX idx_modules_difficulty ON public.modules USING btree (difficulty);

CREATE INDEX idx_modules_order_number ON public.modules USING btree (order_number);

CREATE INDEX idx_profiles_classroom_id ON public.profiles USING btree (classroom_id);

CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);

CREATE INDEX idx_quiz_results_module_id ON public.quiz_results USING btree (module_id);

CREATE INDEX idx_quiz_results_student_id ON public.quiz_results USING btree (student_id);

CREATE INDEX idx_quiz_results_user_id ON public.quiz_results USING btree (user_id);

CREATE INDEX idx_students_classroom_id ON public.students USING btree (classroom_id);

CREATE INDEX idx_students_teacher_id ON public.students USING btree (teacher_id);

CREATE INDEX idx_user_progress_module_id ON public.user_progress USING btree (module_id);

CREATE INDEX idx_user_progress_student_id ON public.user_progress USING btree (student_id);

CREATE INDEX idx_user_progress_user_id ON public.user_progress USING btree (user_id);

CREATE UNIQUE INDEX learning_activities_pkey ON public.learning_activities USING btree (id);

CREATE UNIQUE INDEX modules_pkey ON public.modules USING btree (id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX quiz_results_pkey ON public.quiz_results USING btree (id);

CREATE UNIQUE INDEX students_pkey ON public.students USING btree (id);

CREATE UNIQUE INDEX user_progress_pkey ON public.user_progress USING btree (id);

CREATE UNIQUE INDEX user_progress_user_id_module_id_key ON public.user_progress USING btree (user_id, module_id);

CREATE UNIQUE INDEX user_progress_user_module_unique ON public.user_progress USING btree (user_id, module_id);

alter table "public"."chat_history" add constraint "chat_history_pkey" PRIMARY KEY using index "chat_history_pkey";

alter table "public"."classrooms" add constraint "classrooms_pkey" PRIMARY KEY using index "classrooms_pkey";

alter table "public"."learning_activities" add constraint "learning_activities_pkey" PRIMARY KEY using index "learning_activities_pkey";

alter table "public"."modules" add constraint "modules_pkey" PRIMARY KEY using index "modules_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."quiz_results" add constraint "quiz_results_pkey" PRIMARY KEY using index "quiz_results_pkey";

alter table "public"."students" add constraint "students_pkey" PRIMARY KEY using index "students_pkey";

alter table "public"."user_progress" add constraint "user_progress_pkey" PRIMARY KEY using index "user_progress_pkey";

alter table "public"."chat_history" add constraint "chat_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."chat_history" validate constraint "chat_history_user_id_fkey";

alter table "public"."classrooms" add constraint "classrooms_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."classrooms" validate constraint "classrooms_teacher_id_fkey";

alter table "public"."learning_activities" add constraint "learning_activities_activity_type_check" CHECK ((activity_type = ANY (ARRAY['lesson_view'::text, 'quiz_attempt'::text, 'quiz_complete'::text]))) not valid;

alter table "public"."learning_activities" validate constraint "learning_activities_activity_type_check";

alter table "public"."learning_activities" add constraint "learning_activities_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE SET NULL not valid;

alter table "public"."learning_activities" validate constraint "learning_activities_module_id_fkey";

alter table "public"."learning_activities" add constraint "learning_activities_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE not valid;

alter table "public"."learning_activities" validate constraint "learning_activities_student_id_fkey";

alter table "public"."modules" add constraint "modules_difficulty_check" CHECK ((difficulty = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text]))) not valid;

alter table "public"."modules" validate constraint "modules_difficulty_check";

alter table "public"."profiles" add constraint "profiles_classroom_id_fkey" FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_classroom_id_fkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."quiz_results" add constraint "quiz_results_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE not valid;

alter table "public"."quiz_results" validate constraint "quiz_results_module_id_fkey";

alter table "public"."quiz_results" add constraint "quiz_results_score_check" CHECK (((score >= 0) AND (score <= 100))) not valid;

alter table "public"."quiz_results" validate constraint "quiz_results_score_check";

alter table "public"."quiz_results" add constraint "quiz_results_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE not valid;

alter table "public"."quiz_results" validate constraint "quiz_results_student_id_fkey";

alter table "public"."quiz_results" add constraint "quiz_results_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."quiz_results" validate constraint "quiz_results_user_id_fkey";

alter table "public"."students" add constraint "students_classroom_id_fkey" FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id) ON DELETE SET NULL not valid;

alter table "public"."students" validate constraint "students_classroom_id_fkey";

alter table "public"."students" add constraint "students_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."students" validate constraint "students_teacher_id_fkey";

alter table "public"."user_progress" add constraint "user_progress_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE not valid;

alter table "public"."user_progress" validate constraint "user_progress_module_id_fkey";

alter table "public"."user_progress" add constraint "user_progress_score_check" CHECK (((score >= 0) AND (score <= 100))) not valid;

alter table "public"."user_progress" validate constraint "user_progress_score_check";

alter table "public"."user_progress" add constraint "user_progress_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE not valid;

alter table "public"."user_progress" validate constraint "user_progress_student_id_fkey";

alter table "public"."user_progress" add constraint "user_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_progress" validate constraint "user_progress_user_id_fkey";

alter table "public"."user_progress" add constraint "user_progress_user_id_module_id_key" UNIQUE using index "user_progress_user_id_module_id_key";

alter table "public"."user_progress" add constraint "user_progress_user_module_unique" UNIQUE using index "user_progress_user_module_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."chat_history" to "anon";

grant insert on table "public"."chat_history" to "anon";

grant references on table "public"."chat_history" to "anon";

grant select on table "public"."chat_history" to "anon";

grant trigger on table "public"."chat_history" to "anon";

grant truncate on table "public"."chat_history" to "anon";

grant update on table "public"."chat_history" to "anon";

grant delete on table "public"."chat_history" to "authenticated";

grant insert on table "public"."chat_history" to "authenticated";

grant references on table "public"."chat_history" to "authenticated";

grant select on table "public"."chat_history" to "authenticated";

grant trigger on table "public"."chat_history" to "authenticated";

grant truncate on table "public"."chat_history" to "authenticated";

grant update on table "public"."chat_history" to "authenticated";

grant delete on table "public"."chat_history" to "service_role";

grant insert on table "public"."chat_history" to "service_role";

grant references on table "public"."chat_history" to "service_role";

grant select on table "public"."chat_history" to "service_role";

grant trigger on table "public"."chat_history" to "service_role";

grant truncate on table "public"."chat_history" to "service_role";

grant update on table "public"."chat_history" to "service_role";

grant delete on table "public"."classrooms" to "anon";

grant insert on table "public"."classrooms" to "anon";

grant references on table "public"."classrooms" to "anon";

grant select on table "public"."classrooms" to "anon";

grant trigger on table "public"."classrooms" to "anon";

grant truncate on table "public"."classrooms" to "anon";

grant update on table "public"."classrooms" to "anon";

grant delete on table "public"."classrooms" to "authenticated";

grant insert on table "public"."classrooms" to "authenticated";

grant references on table "public"."classrooms" to "authenticated";

grant select on table "public"."classrooms" to "authenticated";

grant trigger on table "public"."classrooms" to "authenticated";

grant truncate on table "public"."classrooms" to "authenticated";

grant update on table "public"."classrooms" to "authenticated";

grant delete on table "public"."classrooms" to "service_role";

grant insert on table "public"."classrooms" to "service_role";

grant references on table "public"."classrooms" to "service_role";

grant select on table "public"."classrooms" to "service_role";

grant trigger on table "public"."classrooms" to "service_role";

grant truncate on table "public"."classrooms" to "service_role";

grant update on table "public"."classrooms" to "service_role";

grant delete on table "public"."learning_activities" to "anon";

grant insert on table "public"."learning_activities" to "anon";

grant references on table "public"."learning_activities" to "anon";

grant select on table "public"."learning_activities" to "anon";

grant trigger on table "public"."learning_activities" to "anon";

grant truncate on table "public"."learning_activities" to "anon";

grant update on table "public"."learning_activities" to "anon";

grant delete on table "public"."learning_activities" to "authenticated";

grant insert on table "public"."learning_activities" to "authenticated";

grant references on table "public"."learning_activities" to "authenticated";

grant select on table "public"."learning_activities" to "authenticated";

grant trigger on table "public"."learning_activities" to "authenticated";

grant truncate on table "public"."learning_activities" to "authenticated";

grant update on table "public"."learning_activities" to "authenticated";

grant delete on table "public"."learning_activities" to "service_role";

grant insert on table "public"."learning_activities" to "service_role";

grant references on table "public"."learning_activities" to "service_role";

grant select on table "public"."learning_activities" to "service_role";

grant trigger on table "public"."learning_activities" to "service_role";

grant truncate on table "public"."learning_activities" to "service_role";

grant update on table "public"."learning_activities" to "service_role";

grant delete on table "public"."modules" to "anon";

grant insert on table "public"."modules" to "anon";

grant references on table "public"."modules" to "anon";

grant select on table "public"."modules" to "anon";

grant trigger on table "public"."modules" to "anon";

grant truncate on table "public"."modules" to "anon";

grant update on table "public"."modules" to "anon";

grant delete on table "public"."modules" to "authenticated";

grant insert on table "public"."modules" to "authenticated";

grant references on table "public"."modules" to "authenticated";

grant select on table "public"."modules" to "authenticated";

grant trigger on table "public"."modules" to "authenticated";

grant truncate on table "public"."modules" to "authenticated";

grant update on table "public"."modules" to "authenticated";

grant delete on table "public"."modules" to "service_role";

grant insert on table "public"."modules" to "service_role";

grant references on table "public"."modules" to "service_role";

grant select on table "public"."modules" to "service_role";

grant trigger on table "public"."modules" to "service_role";

grant truncate on table "public"."modules" to "service_role";

grant update on table "public"."modules" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."quiz_results" to "anon";

grant insert on table "public"."quiz_results" to "anon";

grant references on table "public"."quiz_results" to "anon";

grant select on table "public"."quiz_results" to "anon";

grant trigger on table "public"."quiz_results" to "anon";

grant truncate on table "public"."quiz_results" to "anon";

grant update on table "public"."quiz_results" to "anon";

grant delete on table "public"."quiz_results" to "authenticated";

grant insert on table "public"."quiz_results" to "authenticated";

grant references on table "public"."quiz_results" to "authenticated";

grant select on table "public"."quiz_results" to "authenticated";

grant trigger on table "public"."quiz_results" to "authenticated";

grant truncate on table "public"."quiz_results" to "authenticated";

grant update on table "public"."quiz_results" to "authenticated";

grant delete on table "public"."quiz_results" to "service_role";

grant insert on table "public"."quiz_results" to "service_role";

grant references on table "public"."quiz_results" to "service_role";

grant select on table "public"."quiz_results" to "service_role";

grant trigger on table "public"."quiz_results" to "service_role";

grant truncate on table "public"."quiz_results" to "service_role";

grant update on table "public"."quiz_results" to "service_role";

grant delete on table "public"."students" to "anon";

grant insert on table "public"."students" to "anon";

grant references on table "public"."students" to "anon";

grant select on table "public"."students" to "anon";

grant trigger on table "public"."students" to "anon";

grant truncate on table "public"."students" to "anon";

grant update on table "public"."students" to "anon";

grant delete on table "public"."students" to "authenticated";

grant insert on table "public"."students" to "authenticated";

grant references on table "public"."students" to "authenticated";

grant select on table "public"."students" to "authenticated";

grant trigger on table "public"."students" to "authenticated";

grant truncate on table "public"."students" to "authenticated";

grant update on table "public"."students" to "authenticated";

grant delete on table "public"."students" to "service_role";

grant insert on table "public"."students" to "service_role";

grant references on table "public"."students" to "service_role";

grant select on table "public"."students" to "service_role";

grant trigger on table "public"."students" to "service_role";

grant truncate on table "public"."students" to "service_role";

grant update on table "public"."students" to "service_role";

grant delete on table "public"."user_progress" to "anon";

grant insert on table "public"."user_progress" to "anon";

grant references on table "public"."user_progress" to "anon";

grant select on table "public"."user_progress" to "anon";

grant trigger on table "public"."user_progress" to "anon";

grant truncate on table "public"."user_progress" to "anon";

grant update on table "public"."user_progress" to "anon";

grant delete on table "public"."user_progress" to "authenticated";

grant insert on table "public"."user_progress" to "authenticated";

grant references on table "public"."user_progress" to "authenticated";

grant select on table "public"."user_progress" to "authenticated";

grant trigger on table "public"."user_progress" to "authenticated";

grant truncate on table "public"."user_progress" to "authenticated";

grant update on table "public"."user_progress" to "authenticated";

grant delete on table "public"."user_progress" to "service_role";

grant insert on table "public"."user_progress" to "service_role";

grant references on table "public"."user_progress" to "service_role";

grant select on table "public"."user_progress" to "service_role";

grant trigger on table "public"."user_progress" to "service_role";

grant truncate on table "public"."user_progress" to "service_role";

grant update on table "public"."user_progress" to "service_role";


  create policy "Users can insert own chat history"
  on "public"."chat_history"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own chat history"
  on "public"."chat_history"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Allow delete for classroom owner"
  on "public"."classrooms"
  as permissive
  for delete
  to public
using ((teacher_id = auth.uid()));



  create policy "Allow insert for authenticated teachers"
  on "public"."classrooms"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



  create policy "Allow select for classroom owner"
  on "public"."classrooms"
  as permissive
  for select
  to public
using ((teacher_id = auth.uid()));



  create policy "Allow update for classroom owner"
  on "public"."classrooms"
  as permissive
  for update
  to public
using ((teacher_id = auth.uid()));



  create policy "Teacher manage own classrooms"
  on "public"."classrooms"
  as permissive
  for all
  to public
using ((teacher_id = auth.uid()));



  create policy "Modules are viewable by everyone"
  on "public"."modules"
  as permissive
  for select
  to public
using (true);



  create policy "Teacher update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((id = auth.uid()));



  create policy "Teacher view own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((id = auth.uid()));



  create policy "Users can insert own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Teacher access quiz results of own students"
  on "public"."quiz_results"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.students s
  WHERE ((s.id = quiz_results.student_id) AND (s.teacher_id = auth.uid())))));



  create policy "Users can insert own quiz results"
  on "public"."quiz_results"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own quiz results"
  on "public"."quiz_results"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Teacher manage own students"
  on "public"."students"
  as permissive
  for all
  to public
using ((teacher_id = auth.uid()));



  create policy "Teacher access progress of own students"
  on "public"."user_progress"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.students s
  WHERE ((s.id = user_progress.student_id) AND (s.teacher_id = auth.uid())))));



  create policy "Users can insert own progress"
  on "public"."user_progress"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own progress"
  on "public"."user_progress"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own progress"
  on "public"."user_progress"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON public.classrooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_profile_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


