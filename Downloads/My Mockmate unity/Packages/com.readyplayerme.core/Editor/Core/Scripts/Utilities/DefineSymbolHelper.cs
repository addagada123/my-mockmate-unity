using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Compilation;

namespace ReadyPlayerMe.Core.Editor
{
    public static class DefineSymbolHelper
    {
        private const string READY_PLAYER_ME_SYMBOL = "READY_PLAYER_ME";

        private static void ModifyScriptingDefineSymbolInAllBuildTargetGroups(string defineSymbol, bool addSymbol)
        {
            foreach (BuildTarget target in Enum.GetValues(typeof(BuildTarget)))
            {
                BuildTargetGroup group = BuildPipeline.GetBuildTargetGroup(target);

                if (group == BuildTargetGroup.Unknown)
                {
                    continue;
                }

                // Use BuildTargetGroup directly to avoid NamedBuildTarget compilation issues in some environments
#if UNITY_2021_2_OR_NEWER
                NamedBuildTarget namedBuildTarget = NamedBuildTarget.FromBuildTargetGroup(group);
                string defineSymbolsStr = PlayerSettings.GetScriptingDefineSymbols(namedBuildTarget);
#else
                string defineSymbolsStr = PlayerSettings.GetScriptingDefineSymbolsForGroup(group);
#endif
                List<string> defineSymbols = defineSymbolsStr.Split(';').Select(d => d.Trim()).ToList();

                if (addSymbol && !defineSymbols.Contains(defineSymbol))
                {
                    defineSymbols.Add(defineSymbol);
                }
                else if (!addSymbol && defineSymbols.Contains(defineSymbol))
                {
                    defineSymbols.Remove(defineSymbol);
                }
                else
                {
                    continue;
                }

                try
                {
#if UNITY_2021_2_OR_NEWER
                    PlayerSettings.SetScriptingDefineSymbols(namedBuildTarget, string.Join(";", defineSymbols.ToArray()));
#else
                    PlayerSettings.SetScriptingDefineSymbolsForGroup(group, string.Join(";", defineSymbols.ToArray()));
#endif
                }
                catch (Exception e)
                {
                    var actionWord = addSymbol ? "set" : "remove";
                    Debug.LogWarning($"Could not {actionWord} {defineSymbol} defines for build target: {target} group: {group} {e}");
                }
            }

            if (addSymbol)
            {
                CompilationPipeline.RequestScriptCompilation();
            }
        }

        public static void AddSymbols()
        {
            ModifyScriptingDefineSymbolInAllBuildTargetGroups(READY_PLAYER_ME_SYMBOL, true);
            CompilationPipeline.RequestScriptCompilation();
        }

        public static void RemoveSymbols()
        {
            ModifyScriptingDefineSymbolInAllBuildTargetGroups(READY_PLAYER_ME_SYMBOL, false);
        }

    }
}
