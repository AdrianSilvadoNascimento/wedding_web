import { Component, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';

export interface Guest {
  id: number;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-guests-list',
  templateUrl: './guests_list.component.html',
  styleUrls: ['./guests_list.component.scss'],
  imports: [MatTableModule],
})
export class GuestsListComponent implements OnInit {
  guests: Guest[] = [
    {
      id: 1,
      name: 'John Doe'
    },
    {
      id: 2,
      name: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Alice Johnson'
    },
    {
      id: 4,
      name: 'Bob Brown'
    },
    {
      id: 5,
      name: 'Charlie Davis'
    },
    {
      id: 6,
      name: 'Diana Evans'
    },
    {
      id: 7,
      name: 'Ethan Foster'
    },
    {
      id: 8,
      name: 'Fiona Green'
    },
    {
      id: 9,
      name: 'George Harris'
    },
    {
      id: 10,
      name: 'Hannah Ives'
    },
    {
      id: 1,
      name: 'John Doe'
    },
    {
      id: 2,
      name: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Alice Johnson'
    },
    {
      id: 4,
      name: 'Bob Brown'
    },
    {
      id: 5,
      name: 'Charlie Davis'
    },
    {
      id: 6,
      name: 'Diana Evans'
    },
    {
      id: 7,
      name: 'Ethan Foster'
    },
    {
      id: 8,
      name: 'Fiona Green'
    },
    {
      id: 9,
      name: 'George Harris'
    },
    {
      id: 10,
      name: 'Hannah Ives'
    },
    {
      id: 1,
      name: 'John Doe'
    },
    {
      id: 2,
      name: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Alice Johnson'
    },
    {
      id: 4,
      name: 'Bob Brown'
    },
    {
      id: 5,
      name: 'Charlie Davis'
    },
    {
      id: 6,
      name: 'Diana Evans'
    },
    {
      id: 7,
      name: 'Ethan Foster'
    },
    {
      id: 8,
      name: 'Fiona Green'
    },
    {
      id: 9,
      name: 'George Harris'
    },
    {
      id: 10,
      name: 'Hannah Ives'
    }
  ]
  displayedColumns: string[] = ['id', 'name'];

  constructor() { }
  
  ngOnInit(): void {
    // Initialization logic can go here if needed
  }
}
