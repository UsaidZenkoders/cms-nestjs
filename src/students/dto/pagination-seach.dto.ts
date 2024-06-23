import { IsNotEmpty } from 'class-validator';

export class PaginationSearchDto {
  @IsNotEmpty()
  page: number;
  @IsNotEmpty()
  limit: number;
  search?: string;
}
