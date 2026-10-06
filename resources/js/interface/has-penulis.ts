// @/interface/has-penulis.ts
import { Penulis } from "@/interface/penulis";
import { PenulisLuar } from "@/interface/penulis-luar";

export interface HasPenulis {
    penulis?: Penulis[];
    penulis_luar?: PenulisLuar[];
}
