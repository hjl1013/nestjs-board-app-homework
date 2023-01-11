import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User, Board, BoardStatus } from '@prisma/client';

@Injectable()
export class BoardsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    // getAllBoards(): Board[] {
    //     return this.boards;
    // }

    //Done
    async getAllBoards(
        user: User
    ): Promise<Board[]> {
        const boards = await this.prisma.board.findMany({
            where: {
                writerId: user.userId
            }
        })

        return boards;
    }

    // createBoard(createBoardDto: CreateBoardDto) {
    //     const { title, description } = createBoardDto;

    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }

    //     this.boards.push(board);
    //     return board;
    // }

    //Done
    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        const {title, description} = createBoardDto;

        const board = await this.prisma.board.create({ 
            data: {
                title,
                description,
                status: BoardStatus.PUBLIC,
                writerId: user.userId
            }
        });

        return board;
    }

    //Done
    async getBoardById(id: number): Promise<Board> {
        const found = await this.prisma.board.findUnique({
            where: {
                boardId: id
            }
        });

        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return found;
    }

    // getBoardById(id: string): Board {
    //     const found = this.boards.find((board) => board.id === id);

    //     if (!found) {
    //         throw new NotFoundException(`Can't find Board with id ${id}`);
    //     }

    //     return found;
    // }

    // Done
    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.prisma.board.deleteMany({
            where: {
                boardId: id,
                writerId: user.userId
            }
        });

        console.log(result);

        if (result.count === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
    }

    // deleteBoard(id: string): void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }

    // Done
    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.prisma.board.update({
            where: {
                boardId: id
            },
            data: {
                status
            }
        })

        return board;
    }
    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

}
