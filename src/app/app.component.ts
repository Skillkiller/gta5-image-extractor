import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Readed } from './entity/readed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gtaimage';

  constructor(private sanitizer: DomSanitizer) {
    this.r.onload = (e) => {
      let r = e.target as FileReader;
  
      let byteArrayFile: Uint8Array = new Uint8Array(r.result as any);
      let byteArray: Uint8Array = new Uint8Array(byteArrayFile.byteLength)
      let index: number = 0;
      const offset: number = 292;
      for(; offset + index < byteArrayFile.byteLength; index++) {
        byteArray[index] = byteArrayFile[offset + index];
  
        if(index >= 3) {
          if(byteArrayFile[offset + index - 1] == 255 && byteArrayFile[offset + index] == 217) {
            break;
          }
        }
      }
  
      
      byteArray = byteArray.slice(0, index + 1);
  
      this.filesReaded.push(
        {
          filename: this.currentFilename,
          source: this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this._arrayBufferToBase64(byteArray))
        });
  
  
      this.readNewFile();
    };
  }

  currentFilename: string = "";
  filesReaded: Readed[] = [];
  filesToRead: File[] = [];

  private r = new FileReader();

  fileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
        return;
    }

    this.r.readAsArrayBuffer(input.files[0]);
    for (let i = 0; i < input.files.length; i++) {
      this.filesToRead.push(input.files[i]);
    }

    this.readNewFile();
  }

  readNewFile() {
    let f = this.filesToRead.pop();

    if (f) {
      this.currentFilename = f.name;
      this.r.readAsArrayBuffer(f);
    }
  }

  _arrayBufferToBase64( buffer: any ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

}