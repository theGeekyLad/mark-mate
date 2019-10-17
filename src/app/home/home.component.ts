import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // vars
  creds: any;
  noteServerDomain: string;
  noteServerPort: string;
  notesList: any;
  showMarkdown: boolean;
  showInput: boolean;
  markdown = 'Example!';

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.noteServerDomain = 'localhost';
    this.noteServerPort = '8000';
    this.showMarkdown = true;
    this.notesList = [];
    this.creds = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * entry point for the app where the user login creates a session and the list of notes
   * for that user is fetched and displayed over webservice calls (x2).
   */
  ngOnInit() {
    // open auth dialog
    this.dialog.open(LoginComponent, {
      data: this.creds
    }).afterClosed().subscribe((res) => {
      this.httpClient.post('http://' + this.noteServerDomain + ':' + this.noteServerPort + '/listNotes', {
        u: this.creds.get('username').value,
        p: this.creds.get('password').value
      }).subscribe((response) => {
        var notes = JSON.parse(JSON.stringify(response)).list.split(',');
        for (let note of notes) {
          this.httpClient.post('http://' + this.noteServerDomain + ':' + this.noteServerPort + '/fetchNote', {
            u: this.creds.get('username').value,
            p: this.creds.get('password').value,
            path: note
          },
            { responseType: 'text' }
          ).subscribe((response) => {
            this.notesList.push(this.formBuilder.group({
              file: note.substring(0, note.length - 3),
              content: [response],
              showMarkdown: [true],
              allowEdits: [false]
            }));
          });
        }
      });
    })
  }

  /**
   * this method saves a note with it's content into the dir belonging to this user
   * as indicated by the session.
   * @param name the exact name of the note as passed by the html
   * @param stuff the content of this file
   */
  saveFile(name: string, stuff: string) {
    this.httpClient.post('http://' + this.noteServerDomain + ':' + this.noteServerPort + '/setNote', {
      file: name,
      content: stuff,
      u: this.creds.get('username').value,
      p: this.creds.get('password').value
    }).subscribe((response) => {
      this.toast('File saved successfully');
    })
  }

  /**
   * creates a blank visual note without any service call for this user
   * which has to be saved in order to appear on reload.
   */
  newNote() {
    this.notesList.push(
      this.formBuilder.group({
        file: ['My Note'],
        content: [''],
        showMarkdown: [false],
        allowEdits: [false]
      })
    );
  }

  /**
   * this method deletes a given note from the user's secured directory on the server and
   * also removes the view.
   * @param name the name of the note that needs to be deleted as passed over by the html
   */
  deleteNote(name: string) {
    this.httpClient.post('http://' + this.noteServerDomain + ':' + this.noteServerPort + '/deleteNote', {
      u: this.creds.get('username').value,
      p: this.creds.get('password').value,
      note: name
    }).subscribe((response) => {
      for (var i = 0; i < this.notesList.length; i++)
        if (this.notesList[i].get('file').value == name) {
          this.notesList.splice(i, 1);
          break;
        }
      this.toast('File delete successfully');
      console.log(JSON.parse(JSON.stringify(response)));
    })
  }

  // shows a snackback with a message and no actions
  toast(message: string) {
    this.snackBar.open(message, null, {
      duration: 1000,
    });
  }

}
