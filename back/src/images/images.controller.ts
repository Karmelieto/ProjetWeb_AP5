import {
Controller,
Get,
Res,
Param,
} from '@nestjs/common'
import {
ApiTags,
ApiOperation
} from '@nestjs/swagger'

@Controller('images')
@ApiTags('images')
export class ImagesController {

    @Get(':fileId')
    @ApiOperation({
        summary: 'Retrieve an image by it id'
    })
    async serveImage(@Param('fileId') fileId: string, @Res() res): Promise<any> {
        res.sendFile(fileId, { root: 'uploads'});
    }

}