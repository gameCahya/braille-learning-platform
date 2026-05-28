import GradeModuleList from "../_components/GradeModuleList";

interface Props {
  searchParams: Promise<{ classId?: string }>;
}

export default function Kelas9Page({ searchParams }: Props) {
  return <GradeModuleList grade={9} searchParams={searchParams} />;
}
