import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Terminal as TerminalIcon } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function TerminalCommand() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setInput("");
    
    // Add command to output
    setOutput(prev => [...prev, `> ${cmd}`]);

    const parts = cmd.split(" ");
    const action = parts[0];
    const target = parts[1];

    switch(action) {
      case "/help":
        setOutput(prev => [...prev, 
          "Commands:",
          "  /resolve [id] - Mark incident as resolved",
          "  /escalate [id] - Escalate incident severity", 
          "  /clear - Clear terminal",
          "  /drill - Simulate active crisis"
        ]);
        break;
        
      case "/clear":
        setOutput(["System ready."]);
        break;

      case "/drill": {
        setOutput(prev => [...prev, "Initiating simulation drill..."]);
        // Simulate a new incident
        const { error: drillErr } = await supabase.from('incidents').insert({
          type: "Security Drill",
          severity: "HIGH",
          location: "Sector 7G",
          description: "Simulated breach for readiness testing.",
          status: "REPORTED"
        });
        if (!drillErr) {
          setOutput(prev => [...prev, "Drill incident injected successfully."]);
        } else {
          setOutput(prev => [...prev, "ERR: Drill initialization failed."]);
        }
        break;
      }

      case "/resolve": {
        if (!target) {
            setOutput(prev => [...prev, "Usage: /resolve [id]"]);
            break;
        }
        
        const { data: resData, error: resErr } = await supabase
            .from('incidents')
            .update({ status: 'RESOLVED' })
            .ilike('id', `${target}%`)
            .select();
            
        if (resErr) {
            setOutput(prev => [...prev, `ERR: Could not resolve ${target}`]);
        } else if (resData && resData.length > 0) {
            setOutput(prev => [...prev, `Incident ${resData[0].id.slice(0,8)} marked RESOLVED.`]);
        } else {
            setOutput(prev => [...prev, `Incident matching ID ${target} not found.`]);
        }
        break;
      }

      default:
        setOutput(prev => [...prev, `Unknown command: ${action}`]);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-950 font-mono text-xs flex flex-col h-[300px]">
      <CardHeader className="py-2 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
            <TerminalIcon className="h-4 w-4" />
        </div>
        <div className="flex gap-1.5">
           <div className="h-2 w-2 rounded-full bg-red-500/20" />
           <div className="h-2 w-2 rounded-full bg-amber-500/20" />
           <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-1">
        {output.map((line, i) => (
          <div key={i} className={`${line.startsWith('>') ? 'text-blue-400' : line.startsWith('ERR') ? 'text-red-500' : 'text-slate-300'}`}>
            {line}
          </div>
        ))}
        <div className="flex gap-2 text-emerald-400 mt-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="bg-transparent border-none outline-none flex-1 text-emerald-400 placeholder:text-emerald-900"
                autoComplete="off"
                spellCheck="false"
            />
        </div>
      </CardContent>
    </Card>
  )
}
