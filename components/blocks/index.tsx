import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks } from "../../tina/__generated__/types";
import { Hero } from "./hero";
import { Content } from "./content";
import dynamic from "next/dynamic";

// Features pulls in the full BoxIcons set (~1 MB) via ../icon. Code-split these
// blocks so their JavaScript only loads on pages that use them. They are still
// server-rendered, so the HTML search engines see is unchanged.
const Features = dynamic(() =>
  import("./features").then((m) => m.Features)
);
const Testimonial = dynamic(() =>
  import("./testimonial").then((m) => m.Testimonial)
);

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  return (
    <>
      {props.blocks
        ? props.blocks.map(function (block, i) {
            return (
              <div key={i} data-tina-field={tinaField(block)}>
                <Block {...block} />
              </div>
            );
          })
        : null}
    </>
  );
};

const Block = (block: PageBlocks) => {
  switch (block.__typename) {
    case "PageBlocksHero":
      return <Hero data={block} />;
    case "PageBlocksContent":
      return <Content data={block} />;
    case "PageBlocksFeatures":
      return <Features data={block} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block} />;
    default:
      return null;
  }
};
