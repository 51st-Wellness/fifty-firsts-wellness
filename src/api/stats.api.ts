import { ResponseDto } from "@/types/response.types";
import http from "./http";

export interface ProgrammeStats {
  totalProgrammes: number;
  publishedProgrammes: number;
  draftProgrammes: number;
  featuredProgrammes: number;
}

export interface OverviewStats extends ProgrammeStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export const fetchProgrammeStats = async (): Promise<
  ProgrammeStats | undefined
> => {
  const response = await http.get<ResponseDto<ProgrammeStats>>(
    "/stats/programmes"
  );
  return response.data.data;
};

export const fetchOverviewStats = async (): Promise<
  OverviewStats | undefined
> => {
  const response = await http.get<ResponseDto<OverviewStats>>(
    "/stats/overview"
  );
  return response.data.data;
};
