import { NextResponse } from "next/server";
import {db} from '../../../configs/db'
import { desc, eq } from 'drizzle-orm';
import {HistoryTable} from '../../../configs/schema'
import {currentUser} from '@clerk/nextjs/server';

export async function POST(req:any) {
  const {content,recordId,aiAgentType}= await req.json();
  const user = await currentUser();
  try{
    //Insert Record 
    const result = await db.insert(HistoryTable).values({
      recordId:recordId,
      content:content,
      userEmail:user?.primaryEmailAddress?.emailAddress,
      createdAt: (new Date()).toString(),
      aiAgentType: aiAgentType
    });
    return NextResponse.json(result)
  }catch(e){
    return NextResponse.json(e)
  }
}



export async function PUT(req:any){
  const {content,recordId}= await req.json();

  try{
    //Update Record
    const result = await db.update(HistoryTable).set({
      content:content,
    }).where(eq(HistoryTable.recordId,recordId))
    return NextResponse.json(result)
  }catch(e){
    return NextResponse.json(e)
  }

}


export async function GET(req:any){
  const {searchParams} = new URL(req.url);
  const recordId = searchParams.get('recordId');
  const user = await currentUser();

  try{

    if(recordId){
    const result = await db.select().from(HistoryTable).where(eq(HistoryTable.recordId,recordId));
    return NextResponse.json(result[0]);
    }
    else
    {
        const result = await db.select().from(HistoryTable).where(eq(HistoryTable.userEmail,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(HistoryTable.id))
        ;
        return NextResponse.json(result);
    }
    return NextResponse.json({})

  }catch(e){
    return NextResponse.json(e);
  }
}