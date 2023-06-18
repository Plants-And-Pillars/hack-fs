import { Polybase } from "@polybase/client";
import { ethPersonalSign } from '@polybase/eth';
import { TreeCollection } from '../collections/tree.collection';
import { UserCollection } from '../collections/user.collection';


export const db = new Polybase({
  signer: (data: any) => {
    return {
      h: 'eth-personal-sign',
      sig: ethPersonalSign(process.env.PRIVATE_KEY, data),
    };
  },
  defaultNamespace: CONFIG.DB_NAMESPACE,
});

export const initPolybase = async () => {
  try {
    await db.applySchema(UserCollection);
  } catch {}

  try {
    await db.applySchema(TreeCollection);
  } catch (err) {
    console.log(err);
  }
};
