import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-health-issue',
  templateUrl: './health-issue.component.html',
  styleUrls: ['./health-issue.component.css']
})
export class HealthIssueComponent implements OnInit {
  public onClose: Subject<boolean>;
  heardHealthIssueModel = {};
  isSubmitted = false;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveHealthIssue(form) {
    this.isSubmitted = false;

    if (form.invalid) {
      this.isSubmitted = true;
      return;
    }
  }
}
