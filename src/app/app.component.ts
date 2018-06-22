import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'indexed db sample';
  db_name = 'sampleDB';
  store_name  = 'sampleStore';
  input_id = '';
  input_name = '';
  data = [];
  db_version = 4;
  ngOnInit(): void {
    const openReq  = indexedDB.open(this.db_name, this.db_version);
    openReq.onupgradeneeded = function(event) {
      console.log('db upgrade');
      const db = event.target.result;
      db.createObjectStore(this.store_name, {keyPath : 'id'});
    }.bind(this);

    openReq.onsuccess = function(event) {
      console.log('db open success');
      const db = event.target.result;
      // 接続を解除する
      db.close();
      this.selectAll();
    }.bind(this);
    openReq.onerror = function(event) {
      // 接続に失敗
      console.log('db open error');
    };
  }
  selectAll(): void {
    const openReq  = indexedDB.open(this.db_name, this.db_version);
    openReq.onsuccess = function(event) {
      console.log('db open success');
      const db = event.target.result;
      const trans = db.transaction(this.store_name, 'readonly');
      const store = trans.objectStore(this.store_name);
      const getReq = store.getAll();

      getReq.onsuccess = function(ev) {
        this.data = ev.target.result;
      }.bind(this);
      // 接続を解除する
      db.close();
    }.bind(this);
  }
  onAdd(): void {
    const d = {id : this.input_id, name : this.input_name};

    const openReq = indexedDB.open(this.db_name);

    openReq.onsuccess = function(event) {
      const db = event.target.result;
      const trans = db.transaction(this.store_name, 'readwrite');
      const store = trans.objectStore(this.store_name);
      const putReq = store.put(d);

      putReq.onsuccess = function() {
        console.log('put data success');
      };

      trans.oncomplete = function() {
        // トランザクション完了時(putReq.onsuccessの後)に実行
        console.log('transaction complete');
        this.selectAll();
      }.bind(this);
    }.bind(this);
  }
  onDelete(id): void {
    const openReq = indexedDB.open(this.db_name);

    openReq.onsuccess = function(event) {
      const db = event.target.result;
      const trans = db.transaction(this.store_name, 'readwrite');
      const store = trans.objectStore(this.store_name);
      const delReq = store.delete(id);

      delReq.onsuccess = function() {
        this.selectAll();
      }.bind(this);

      delReq.onerror = function() {
        alert('削除失敗');
      };

    }.bind(this);
  }
}
