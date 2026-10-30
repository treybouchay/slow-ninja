import { cn } from "@/lib/utils";

const CORNER = "/ui/command-dialog/corner.png";
const CORNER_B = "/ui/command-dialog/corner-b.png";
const EDGE_A = "/ui/command-dialog/edge-a.png";
const EDGE_B = "/ui/command-dialog/edge-b.png";

function PixelImg({ src, className }: { src: string; className?: string }) {
  return (
    <img
      alt=""
      src={src}
      draggable={false}
      className={cn(
        "pointer-events-none max-w-none object-cover [image-rendering:pixelated]",
        className,
      )}
    />
  );
}

/** Horizontal frame strip. The source edge is rotated so its pixels run along the bar. */
function Rail({ src, flip = false }: { src: string; flip?: boolean }) {
  return (
    <div className="relative h-1 min-w-0 flex-1 overflow-hidden [container-type:size]">
      <PixelImg
        src={src}
        className={cn(
          "absolute top-1/2 left-1/2 h-[100cqw] w-1 -translate-x-1/2 -translate-y-1/2 -rotate-90",
          flip && "-scale-y-100",
        )}
      />
    </div>
  );
}

/**
 * Structs player text screen. The pixel frame is the design's corner and edge
 * sprites, and the body is the player surface with its dark border.
 */
export function CommandDialog({ message }: { message: string }) {
  return (
    <div className="flex w-full flex-col" data-command-dialog>
      <div className="flex w-full items-start">
        <PixelImg src={CORNER} className="size-1 shrink-0" />
        <Rail src={EDGE_A} />
        <PixelImg src={CORNER_B} className="size-1 shrink-0" />
      </div>
      <div className="flex w-full items-stretch">
        <div className="relative w-1 self-stretch">
          <PixelImg src={EDGE_B} className="absolute inset-0 size-full" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-2 border-solid border-[#2e1f3e] bg-[#133546]">
          <div className="flex min-h-10 w-full items-center overflow-hidden border-2 border-solid border-[#2e1f3e] bg-[#133546] p-2">
            <p className="command-dialog-copy min-w-0 flex-1 text-[#c5d7d9]">
              <span className="text-[#43cdb6]">STRUCT COMMAND:</span> {message}
            </p>
          </div>
        </div>
        <div className="relative w-1 self-stretch">
          <PixelImg src={EDGE_A} className="absolute inset-0 size-full" />
        </div>
      </div>
      <div className="flex w-full items-start">
        <div className="shrink-0 -scale-y-100">
          <PixelImg src={CORNER} className="size-1" />
        </div>
        <Rail src={EDGE_B} flip />
        <div className="shrink-0 rotate-180">
          <PixelImg src={CORNER} className="size-1" />
        </div>
      </div>
    </div>
  );
}
