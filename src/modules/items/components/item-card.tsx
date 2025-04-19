import type { ItemSelect } from "@/lib/types";
import { Card, Heading, Inset, Text } from "@radix-ui/themes";
import React from "react";
import ItemImage from "./item-image";
import { getItemImageUrl } from "@/lib/client/utils";
import ItemImageDialog from "./item-image-dialog";

type Props = {
  item: ItemSelect;
};

const ItemCard: React.FC<Props> = ({ item }) => {
  const imageUrl = getItemImageUrl(item);
  return (
    <Card className="flex gap-4">
      <Inset pr="current">
        <ItemImageDialog item={item} />
      </Inset>
      <section className="flex flex-col gap-1">
        <Heading as="h3" size="3" weight="medium">
          {item.name}
        </Heading>
        <Text color="gray">{item.description}</Text>
      </section>
    </Card>
  );
};

export default ItemCard;
