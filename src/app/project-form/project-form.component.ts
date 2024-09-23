import { Component, Inject, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit{
  projectForm!: FormGroup;
  allUsers: User[];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: Project, users: User[] }
  ) {
    this.allUsers = data.users;
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      id: [this.data.project.id],
      title: [this.data.project.title, Validators.required],
      description: [this.data.project.description],
      clientName: [this.data.project.clientName],
      startDate: [this.data.project.startDate],
      endDate: [this.data.project.endDate],
      members: [this.data.project.members || []]
    });
  }

  compareUsers(user1: User, user2: User): boolean {
    return user1 && user2 ? user1.id === user2.id : user1 === user2;
  }

  onSave(): void {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
