import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { OpenVidu } from 'openvidu-node-client';

@Controller()
export class LiveController {
  private readonly OPENVIDU_URL: string =
    process.env.OPENVIDU_URL || 'http://172.22.240.1:4443';
  private readonly OPENVIDU_SECRET: string =
    process.env.OPENVIDU_SECRET || 'MY_SECRET';
  private readonly openvidu: OpenVidu = new OpenVidu(
    this.OPENVIDU_URL,
    this.OPENVIDU_SECRET,
  );

  @Post('api/sessions')
  async sessions(@Req() req, @Res() res) {
    try {
      const session = await this.openvidu.createSession(req.body);
      res.status(HttpStatus.CREATED).send(session.sessionId);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
  @Post('api/sessions/:sessionId/connections')
  async sessionsConnections(@Req() req, @Res() res, @Param() params) {
    try {
      const session = this.openvidu.activeSessions.find(
        (s) => s.sessionId === req.params.sessionId,
      );
      if (!session) {
        res.status(HttpStatus.NOT_FOUND).send();
      } else {
        const connection = await session.createConnection(req.body);
        res.status(HttpStatus.CREATED).send(connection.token);
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
