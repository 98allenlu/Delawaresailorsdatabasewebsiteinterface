export interface Voyage {
  id: string;
  vessel: string;
  date: string;
  route: string;
}

export interface Sailor {
  id: string;
  name: string;
  hometown: string;
  yearOfBirth: string;
  description: {
    complexion: string;
    height: string;
    hairColor: string;
    markings: string;
  };
  voyages: Voyage[];
}

export const sailors: Sailor[] = [
  {
    id: "peter-johnson",
    name: "Peter Johnson",
    hometown: "Lewes, Delaware",
    yearOfBirth: "1788",
    description: {
      complexion: "Light",
      height: "5' 3¾\"",
      hairColor: "Dark",
      markings: "—",
    },
    voyages: [
      { id: "v1", vessel: "Ship Jane", date: "12/23/1815", route: "—" },
      { id: "v2", vessel: "Ship Jane", date: "7/19/1816",  route: "—" },
      { id: "v3", vessel: "Ship Jane", date: "12/19/1816", route: "—" },
      { id: "v4", vessel: "Ship Jane", date: "9/23/1817",  route: "—" },
      { id: "v5", vessel: "Ship Jane", date: "1/29/1818",  route: "—" },
      { id: "v6", vessel: "Ship Jane", date: "7/27/1818",  route: "—" },
    ],
  },
  {
    id: "james-forten",
    name: "James Forten",
    hometown: "Philadelphia, Pennsylvania",
    yearOfBirth: "1766",
    description: {
      complexion: "Black",
      height: "5' 8\"",
      hairColor: "Black",
      markings: "Scar on left hand",
    },
    voyages: [
      { id: "v1", vessel: "The Fair American", date: "1780", route: "Philadelphia to Caribbean" },
      { id: "v2", vessel: "Royal Louis",        date: "1781", route: "Philadelphia Coast Guard" },
    ],
  },
  {
    id: "william-smith",
    name: "William Smith",
    hometown: "Wilmington, Delaware",
    yearOfBirth: "1772",
    description: {
      complexion: "Dark",
      height: "5' 10\"",
      hairColor: "Brown",
      markings: "Tattoo on right forearm",
    },
    voyages: [
      { id: "v1", vessel: "Betsey",      date: "3/14/1801", route: "Wilmington to London" },
      { id: "v2", vessel: "Betsey",      date: "9/2/1801",  route: "London to Wilmington" },
      { id: "v3", vessel: "Providence",  date: "5/17/1803", route: "Wilmington to Barbados" },
    ],
  },
  {
    id: "thomas-jones",
    name: "Thomas Jones",
    hometown: "New Castle, Delaware",
    yearOfBirth: "1780",
    description: {
      complexion: "Ruddy",
      height: "5' 6\"",
      hairColor: "Red",
      markings: "Missing tip of left index finger",
    },
    voyages: [
      { id: "v1", vessel: "Sally",  date: "6/1/1808",  route: "New Castle to Bordeaux" },
      { id: "v2", vessel: "Sally",  date: "11/9/1808", route: "Bordeaux to New Castle" },
    ],
  },
];
