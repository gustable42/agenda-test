import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ContatoComponent } from './contato.component';
import { FormGroup } from '@angular/forms';

export function showContato(
  dialog: MatDialog,
  contato: FormGroup
): MatDialogRef<ContatoComponent> {
  return dialog.open(ContatoComponent, {
    data: { dialog, contato },
    height: "fit-content",
    width: "60vw",
  });
}
