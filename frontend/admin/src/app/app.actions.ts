import { MatSnackBarConfig } from "@angular/material";

export class ShowGlobalSnackBarAction {
  static readonly type = "[app] show global snackbar";

  constructor(
    public message: string,
    public config: MatSnackBarConfig = {
      duration: 3000
    }
  ) {}
}
