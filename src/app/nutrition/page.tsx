import { redirect } from "next/navigation"
import { PATH } from "@/constants/path"

/** Legacy route — dashboard lives on home */
export default function NutritionPage() {
  redirect(PATH.HOME)
}
