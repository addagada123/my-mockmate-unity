using UnityEngine;
using ReadyPlayerMe.Core;

public class AvatarLoader : MonoBehaviour
{
    public string avatarUrl;
    public Transform seatAnchor;
    public RuntimeAnimatorController animatorController;

    void Start()
    {
        AvatarObjectLoader loader = new AvatarObjectLoader();

        loader.OnCompleted += (sender, args) =>
        {
            GameObject avatar = args.Avatar;

            avatar.transform.SetParent(seatAnchor);
            avatar.transform.localPosition = Vector3.zero;
            avatar.transform.localRotation = Quaternion.identity;
            avatar.transform.localScale = Vector3.one * 60f;

            Animator animator = avatar.GetComponent<Animator>();
            if (animatorController != null)
                animator.runtimeAnimatorController = animatorController;
        };

        loader.LoadAvatar(avatarUrl);
    }
}