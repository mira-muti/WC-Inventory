create type "public"."box_status_enum" as enum ('Active', 'Donated', 'Archived');

create type "public"."gender_enum" as enum ('Male', 'Female', 'Unisex');

create type "public"."movement_type_enum" as enum ('Create', 'Move', 'Donate', 'Archive');

create type "public"."size_enum" as enum ('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

create type "public"."user_role_enum" as enum ('Volunteer', 'Admin');

create sequence "public"."categories_category_id_seq";

create sequence "public"."locations_location_id_seq";

create table "public"."categories" (
    "category_id" integer not null default nextval('categories_category_id_seq'::regclass),
    "name" character varying(100) not null,
    "description" text,
    "level" integer not null,
    "parent_id" integer
);


create table "public"."locations" (
    "location_id" integer not null default nextval('locations_location_id_seq'::regclass),
    "name" character varying(100) not null,
    "description" text,
    "level" integer,
    "parent_id" integer
);


create table "public"."users" (
    "id" uuid not null,
    "first_name" character varying(50) not null,
    "last_name" character varying(50) not null,
    "role" user_role_enum not null default 'Volunteer'::user_role_enum,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter sequence "public"."categories_category_id_seq" owned by "public"."categories"."category_id";

alter sequence "public"."locations_location_id_seq" owned by "public"."locations"."location_id";

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (category_id);

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (location_id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."categories" add constraint "categories_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES categories(category_id) not valid;

alter table "public"."categories" validate constraint "categories_parent_id_fkey";

alter table "public"."locations" add constraint "locations_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES locations(location_id) not valid;

alter table "public"."locations" validate constraint "locations_parent_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_metadata JSONB;
  first_name TEXT;
  last_name TEXT;
  role_text TEXT;
  role user_role_enum;
BEGIN
  -- Extract user metadata from auth.users
  user_metadata := NEW.raw_user_meta_data;
  first_name := user_metadata ->> 'first_name';
  last_name := user_metadata ->> 'last_name';
  role_text := user_metadata ->> 'role';

  -- Default role to 'Volunteer' if not provided or invalid
  IF role_text IS NULL OR NOT (role_text = ANY(ARRAY['Volunteer', 'Admin'])) THEN
    role := 'Volunteer';
  ELSE
    role := role_text::user_role_enum;
  END IF;

  -- Insert into public.users
  INSERT INTO public.users (id, first_name, last_name, role, created_at, updated_at)
  VALUES (NEW.id, first_name, last_name, role, NOW(), NOW());

  RETURN NEW;
END;
$function$
;

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."locations" to "anon";

grant insert on table "public"."locations" to "anon";

grant references on table "public"."locations" to "anon";

grant select on table "public"."locations" to "anon";

grant trigger on table "public"."locations" to "anon";

grant truncate on table "public"."locations" to "anon";

grant update on table "public"."locations" to "anon";

grant delete on table "public"."locations" to "authenticated";

grant insert on table "public"."locations" to "authenticated";

grant references on table "public"."locations" to "authenticated";

grant select on table "public"."locations" to "authenticated";

grant trigger on table "public"."locations" to "authenticated";

grant truncate on table "public"."locations" to "authenticated";

grant update on table "public"."locations" to "authenticated";

grant delete on table "public"."locations" to "service_role";

grant insert on table "public"."locations" to "service_role";

grant references on table "public"."locations" to "service_role";

grant select on table "public"."locations" to "service_role";

grant trigger on table "public"."locations" to "service_role";

grant truncate on table "public"."locations" to "service_role";

grant update on table "public"."locations" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


