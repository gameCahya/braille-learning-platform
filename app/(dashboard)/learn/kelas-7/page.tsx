import GradeModuleList from "../_components/GradeModuleList";

interface Props {
  searchParams: Promise<{ classId?: string }>;
}

export default function Kelas7Page({ searchParams }: Props) {
  return <GradeModuleList grade={7} searchParams={searchParams} />;
}
