import { vec4 } from "gl-matrix"
import { VFC } from "react"
import { IRect } from "../../../../common/geometry"
import { useProjectionMatrix } from "../../../hooks/useProjectionMatrix"
import { GLNode } from "../../GLSurface/GLNode"
import {
  ISelectionData,
  IVelocityData,
  NoteBuffer,
  NoteShader,
} from "../PianoRollRenderer/NoteShader"

export interface NoteRectanglesProps {
  rects: (IRect & IVelocityData & ISelectionData)[]
  fillColor: vec4
  strokeColor: vec4
  zIndex?: number
}

export const NoteRectangles: VFC<NoteRectanglesProps> = ({
  rects,
  fillColor,
  strokeColor,
  zIndex,
}) => {
  const projectionMatrix = useProjectionMatrix()

  return (
    <GLNode
      createShader={NoteShader}
      createBuffer={(gl) => new NoteBuffer(gl)}
      uniforms={{ projectionMatrix, fillColor, strokeColor }}
      buffer={rects}
      zIndex={zIndex}
    />
  )
}
