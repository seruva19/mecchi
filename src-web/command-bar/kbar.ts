import { useMatches } from "kbar";
import { style } from "twind/style";

export const actions = [
  {
    id: "reload",
    name: "Reload Mecchi",
    shortcut: ["r"],
    keywords: "reload",
    perform: () => console.log('reload'),
  },
  {
    id: "clear",
    name: "Clear Workspace",
    shortcut: ["c"],
    keywords: "clear",
    perform: () => console.log('reload'),
  },
  {
    id: "save",
    name: "Fast save",
    shortcut: ["s"],
    keywords: "save",
    perform: () => console.log('save'),
  },
  {
    id: "load",
    name: "Fast load",
    shortcut: ["l"],
    keywords: "load",
    perform: () => console.log('load'),
  }
]