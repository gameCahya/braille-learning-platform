import GradeModuleList from "../_components/GradeModuleList";

interface Props {
  searchParams: Promise<{ classId?: string }>;
}

export default function Kelas8Page({ searchParams }: Props) {
  return <GradeModuleList grade={8} searchParams={searchParams} />;
}
