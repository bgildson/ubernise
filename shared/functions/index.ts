import {
  DocumentChangeAction,
  DocumentSnapshot,
  Action
} from "../../frontend/node_modules/angularfire2/firestore";

export const listToEntities = (pk: string = "id") => (list: any[]) =>
  list.reduce(
    (prev, curr) => ({
      ...prev,
      [curr[pk]]: curr
    }),
    {}
  );

export const entitiesToList = <Model extends any>(
  pk: string = "id"
) => (entities: { [_pk: string]: Model }) =>
  Object.keys(entities).map((id: string) => ({
    ...(<any>entities[id]),
    [pk]: id
  }));

export const documentChangeActionToEntities = <Entity extends any>(
  pk: string = "id"
) => (documents: DocumentChangeAction<any>[]) =>
  documents.reduce<Entity>(
    (prev: Entity, { payload }) => ({
      ...(<any>prev),
      [payload.doc.id]: {
        ...payload.doc.data(),
        [pk]: payload.doc.id
      }
    }),
    <Entity>{}
  );

export const actionDocumentSnapshotToModel = <Model extends any>(
  pk: string = "id"
) => (document: Action<DocumentSnapshot<any>>): Model => ({
  ...document.payload.data(),
  [pk]: document.payload.id
});

export const parseFormValueToQueryParams = formValue =>
  Object.entries(formValue).reduce(
    (params, [key, value]) =>
      value !== null && value !== undefined
        ? { ...params, [key]: value }
        : params,
    {}
  );
