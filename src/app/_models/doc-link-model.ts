
export enum DocType {
  DOC_1    = 'doc1',
  DOC_2 = 'doc2',
  DOC_3   = 'doc3',
}


export interface  DocLink {

    id: number,
    user_id: number,
    doc_type: string,
    doc_url: string,
    created_at: Date

}

