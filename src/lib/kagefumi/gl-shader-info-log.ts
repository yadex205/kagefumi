interface GlShaderInfoLogLine {
  severity: string;
  line?: number;
  message?: string;
}

const glShaderInfoLogLineRegex = /^(?<severity>ERROR|WARNING): (\d+:(?<line>\d+): )?(?<message>.+)$/;

export class GlShaderInfoLog extends Array<GlShaderInfoLogLine> {
  private _glShaderInfoLogString = "";

  public static parse(glShaderInfoLogString: string) {
    const glShaderInfoLog = new GlShaderInfoLog()
    glShaderInfoLog.parse(glShaderInfoLogString);

    return glShaderInfoLog;
  }

  public parse(glShaderInfoLogString: string) {
    glShaderInfoLogString.trim().split(/\n/g).forEach(glShaderInfoLogLineString => {
      const match = glShaderInfoLogLineRegex.exec(glShaderInfoLogLineString);
      const severity = match?.groups?.severity?.toLowerCase() || "unknown";
      const line = match?.groups?.line !== undefined ? parseInt(match?.groups?.line) : undefined;
      const message = match?.groups?.message;

      this.push({ severity, line, message })
    });

    this._glShaderInfoLogString = glShaderInfoLogString;
  }

  public toString() {
    return this._glShaderInfoLogString;
  }
}
